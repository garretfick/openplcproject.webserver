use sysinfo::{Pid, ProcessExt, System, SystemExt};
use std::sync::{Arc, RwLock};
use std::process::Command;
use std::time::{Duration, Instant};
use tokio::io::{BufReader, AsyncBufReadExt};
use tokio::process::Command as TokioCommand;
use std::process::{Stdio};
use std::fmt;

// The PLC is in one of the follow stated (where we start in
// Initialize which can directly transition to any one of the
// states.
//
// We model Stopping as state to respond to a user-based request
// to stop a process.
//
// +-----------+          +-----------+          +-----------+
// |           |<---------|           |--------->|           |
// | Compiling |          | Stopped   |          | Running   |
// |           |--------->|           |<---------|           |
// +-----------+          +-----------+          +-----------+
//       |                      ^                      |
//       |                      |                      |
//       |                +-----------+                |
//       |                |           |                |
//       +--------------->| Stopping  |<---------------+
//                        |           |
//                        +-----------+

// Returns the command to start the PLC.
fn plc_start_command() -> &'static str {
    let command = if cfg!(unix) {
        "openplc"
      } else if cfg!(windows) {
        "startplc.bat"
      } else {
        "unknown"
      };
      command
}

fn plc_process_name() -> &'static str {
    let process = if cfg!(unix) {
        "openplc"
      } else if cfg!(windows) {
        "openplc.exe"
      } else {
        "unknown"
      };
      process
}

fn plc_compile_command() -> &'static str {
    let command = if cfg!(unix) {
        "compile"
      } else if cfg!(windows) {
        "compile.bat"
      } else {
        "unknown"
      };
      command
}

fn plc_change_hardware_command() -> &'static str {
    let command = if cfg!(unix) {
        "change_hardware_layer.sh"
      } else if cfg!(windows) {
        "change_hardware_layer.bat"
      } else {
        "unknown"
      };
      command
}

type StateResult<T = PlcState, E = String> = std::result::Result<T, E>;

// The states of the PLC
#[derive(Debug, Copy, Clone, PartialEq)]
pub enum PlcState {
    // Initialize is our initial state before we have had
    // an opportunity to determine discover whether the PLC
    // is running.
    Initialize,
    Stopped,
    Stopping(Pid),
    Running(Pid),
    Compiling(Pid),
}

impl fmt::Display for PlcState {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
       match &*self {
           PlcState::Initialize => write!(f, "State: Initialize"),
           PlcState::Stopped => write!(f, "State: Stopped"),
           PlcState::Stopping(pid) => write!(f, "State: Stopping {}", pid),
           PlcState::Running(pid) => write!(f, "State: Running {}", pid),
           PlcState::Compiling(pid) => write!(f, "State: Compiling {}", pid),
       }
    }
}

// The events we can send to the PLC that influence its state.
// We interact with the PLC by sending a stream of events.
#[derive(Debug)]
pub enum PlcEvent {
    // The no-op event is for polling. We send a regular stream
    // of events. If we are not changing the state, then we are
    // verifying the state. The NoOp event says "don't try to
    // change the state, but do verify that it hasn't changed."
    NoOp,
    Compile(String),
    SetHardware(String),
    Run(String),
    // TODO this should be a process ID
    Stop,
}

impl fmt::Display for PlcEvent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
       match &*self {
           PlcEvent::NoOp => write!(f, "Event: NoOp"),
           PlcEvent::Compile(file) => write!(f, "Event: Compile {}", &file),
           PlcEvent::SetHardware(name) => write!(f, "Event: Set Hardware {}", &name),
           PlcEvent::Run(file) => write!(f, "Event: Run {}", &file),
           PlcEvent::Stop => write!(f, "Event: Stop"),
       }
    }
}

impl PlcState {
    pub fn next(self, event: PlcEvent) -> StateResult {
        use self::PlcState::*;
        use self::PlcEvent::*;

        // Match the current state and the event. Many transitions are
        // only valid while stopped.
        match (self, event) {
            (Initialize, NoOp) => discover(),
            (Initialize, Stop) => discover(),

            (Stopped, NoOp) => Ok(Stopped),
            (Stopped, Stop) => Ok(Stopped),
            (Stopped, Compile(file)) => compile_program(file),
            (Stopped, SetHardware(name)) => change_hardware(name),
            (Stopped, Run(file)) => start_program(file),

            (Compiling(pid), NoOp) =>  is_proc_running(pid),
            (Compiling(pid), Stop) => stop_proc(pid),
            
            (Running(pid), NoOp) => is_proc_running(pid),
            (Running(pid), Stop) => stop_proc(pid),

            (Stopping(pid), NoOp) => is_proc_running(pid),
            (Stopping(pid), Stop) => stop_proc(pid),

            // Catch-all for other transitions. These transitions
            // are not valid so we stay in our current state.
            (state, event) => Err(format!("Invalid transition: event {} not valid in {}", event, state)),
        }
    }
}

// The PLC singleton instance. The PLC instance keeps track of what
// is currently happening on the PLC (whether running, compiling or
// nothing).
pub struct PlcStateMachine {
    pub state: PlcState,
}

impl PlcStateMachine {
    // Creates a new instance of the state machine. The state machine
    // beings in the initialize state (which implies unknown state).
    // As an example, the state is unknown because the PLC can run without
    // the web server.
     fn new() -> Self {
        PlcStateMachine {
            state: PlcState::Initialize
        }
    }

    // Receives events that can cause the PLD to transition to another state.
    // Events might originate from and event pump or based on a particular
    // request. 
    pub fn run(&mut self, event: PlcEvent) -> StateResult {
        println!("{}", event);
        let result = self.state.next(event);
        match result {
            Ok(state) => {
                self.state = state;
                return Ok(self.state);
            },
            Err(msg) => {
                return Err(msg);
            }
        }
    }
}

fn discover() -> StateResult {
    use self::PlcState::*;

    // Try to determine if openplc application is running.
    let s = System::new_all();
    for process in s.processes_by_exact_name(plc_process_name()) {
        return Ok(Running(process.pid()));
    }

    Ok(Stopped)
}

fn is_proc_running(pid: Pid) -> StateResult {
    use self::PlcState::*;
    let s = System::new_all();
    if let Some(process) = s.process(pid) {
        return Ok(Running(pid))
    }
    Ok(Stopped)
}

fn stop_proc(pid: Pid) -> StateResult {
    use self::PlcState::*;
    Ok(Stopping(pid))
}

fn start_program(file: String) -> StateResult {
    use self::PlcState::*;
    let mut start = Command::new(plc_start_command());
    match start.output() {
        Ok(output) => {
            // Although we started a process, we don't know that
            // what we started was the PLC process directly. So,
            // we still need to find the process.
            match find_process_pid(plc_process_name()) {
                Ok(pid) => {
                    return Ok(Running(pid))
                },
                Err(e) => {
                    return Err(e.to_string())
                } 
            }
        },
        Err(e) => {
            return Err(e.to_string())
        }
    }
}

fn find_process_pid(file: &'static str) -> Result<Pid, &'static str> {
    let s = System::new_all();
    for process in s.processes_by_exact_name(plc_process_name()) {
        return Ok(process.pid());
    }
    Err("no such process")
}

fn compile_program(file: String) -> StateResult {
    println!("Compile {}", file);
    use self::PlcState::*;
    let mut start = Command::new(plc_compile_command());
    match start.output() {
        Ok(output) => {
            // Although we started a process, we don't know that
            // what we started was the PLC process directly. So,
            // we still need to find the process.
            match find_process_pid(plc_process_name()) {
                Ok(pid) => {
                    return Ok(Running(pid))
                },
                Err(e) => {
                    return Err(e.to_string())
                } 
            }
        },
        Err(e) => {
            println!("Failed to start {}", e);
            return Err(e.to_string())
        }
    }
}

fn change_hardware(name: String) -> StateResult {
    println!("Change Hardware {}", name);

    use self::PlcState::*;
    let status = Command::new(plc_start_command())
        .arg(&name)
        .current_dir("/bin")
        .status();

    match status {
        Ok(status) => return Ok(Stopped),
        Err(e) => return Err(e.to_string())
    }
}

async fn run_command(cmd: &str) -> Result<(), Box<dyn std::error::Error>> {
    let mut cmd = TokioCommand::new(cmd);

    // Specify that we want the command's standard output piped back to us.
    // By default, standard input/output/error will be inherited from the
    // current process (for example, this means that standard input will
    // come from the keyboard and standard output/error will go directly to
    // the terminal if this process is invoked from the command line).
    cmd.stdout(Stdio::piped());

    let mut child = cmd.spawn()
        .expect("failed to spawn command");

    let stdout = child.stdout.take()
        .expect("child did not have a handle to stdout");

    let mut reader = BufReader::new(stdout).lines();

    // Ensure the child process is spawned in the runtime so it can
    // make progress on its own while we await for any output.
    tokio::spawn(async move {
        let status = child.wait().await
            .expect("child process encountered an error");

        println!("child status was: {}", status);
    });

    while let Some(line) = reader.next_line().await? {
        println!("Line: {}", line);
    }

    Ok(())
}

// Provides a sharable object that mediates access to the PLC state machine.
#[derive(Clone)]
pub struct SharedPlcStateMachine {
    pub sm: Arc<RwLock<PlcStateMachine>>
}

impl SharedPlcStateMachine {
    pub fn new() -> Self {
        use self::*;
        SharedPlcStateMachine {
            sm: Arc::new(RwLock::new(PlcStateMachine::new()))
        }
    }

    pub async fn transition(&self, event: PlcEvent, timeout: Duration) -> StateResult {
        use self::PlcState::*;
        use self::PlcEvent::*;

        let poll_end = Instant::now() + timeout;

        // We will sleep no less that every 100 ms (or the timeout)
        // whichever is less.
        let sleep_for = Duration::from_millis(100).min(timeout);

        // Long poll where we wait for the PLC to stop.
        while Instant::now() < poll_end {
            // Try to get write access to the PLC - that's the only way
            // that we would be able to guarantee that we can transition
            // using the event.
            if let Ok(mut plc) = self.sm.write() {
                plc.run(Stop);
                if plc.state == Stopped {
                    return plc.run(event);
                }
            }
            
            // If we didn't return, then we are not in the stopped state.
            // Sleep until our next attempt.
            tokio::time::sleep(sleep_for).await;
        }

        // We give one last attempt to stop directly. We don't care what
        // the return value is here.
        if let Ok(mut plc) = self.sm.write() {
            plc.run(Stop);
            if plc.state == Stopped {
                return plc.run(event);
            }
        }

        return Err("Timed out waiting to stop".to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_initial_state_initialize() {
        let sm = PlcStateMachine::new();
        assert_matches!(sm.state, PlcState::Initialize);
    }

    #[test]
    fn test_initial_state_noop_then_stopped() {
        let mut sm = PlcStateMachine::new();
        sm.run(PlcEvent::NoOp).expect("success changing state");
        assert_matches!(sm.state, PlcState::Stopped);
    }

    #[test]
    fn test_initial_state_stop_then_stopped() {
        let mut sm = PlcStateMachine::new();
        sm.run(PlcEvent::Stop).expect("success changing state");
        assert_matches!(sm.state, PlcState::Stopped);
    }
}

