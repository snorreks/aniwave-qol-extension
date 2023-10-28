use std::io::{self, Read, Write};
use enigo::{Enigo, Key, KeyboardControllable, MouseButton, MouseControllable};
use serde::Deserialize;
use serde_json::Value;
use std::time::{Duration, Instant};
// Define the different kinds of actions that can be performed
pub enum Action {
    KeyClick { key: char },
    MouseClick { x: Option<i32>, y: Option<i32> },
}

// Define the structure of the overall input data
pub struct InputData {
    pub action: Action,
}

/// Simulate pressing a specified key.
pub fn press_key(key: char) {
    let mut enigo = Enigo::new();
    enigo.key_click(Key::Layout(key));
    println!("Simulated pressing '{}' key.", key);
}

/// Simulate a mouse click at given coordinates.
/// If x or y is None, the mouse will move to the current location on that axis.
pub fn click_mouse(x: Option<i32>, y: Option<i32>) {
    let mut enigo = Enigo::new();
    // check if either x or y is defined, if so move the mouse
    if x.is_some() || y.is_some() {
        let (current_x, current_y) = enigo.mouse_location();
        let new_x = x.unwrap_or(current_x);
        let new_y = y.unwrap_or(current_y);
        enigo.mouse_move_to(new_x, new_y);
        println!("Simulated mouse move to ({}, {}).", new_x, new_y);
    }
    enigo.mouse_click(MouseButton::Left);
    println!("Simulated mouse click.");
}

/// Simulate a mouse click at the center of the main display.
pub fn click_center() {
    let mut enigo = Enigo::new();
    let (width, height) = enigo.main_display_size();
    let center_x = width / 2;
    let center_y = height / 2;
    enigo.mouse_move_to(center_x, center_y);
    println!("Simulated mouse move to center at ({}, {}).", center_x, center_y);
    enigo.mouse_click(MouseButton::Left);
    println!("Simulated mouse click at center.");
}

/// Read input from stdin as a String with a timeout.
pub fn read_input_with_timeout() -> io::Result<String> {
    println!("read_input starting");

    // Set a timeout duration of 3 seconds
    let timeout_duration = Duration::from_secs(3);

    // Start measuring elapsed time
    let start_time = Instant::now();

    let mut length_bytes = [0; 4];
    io::stdin().read_exact(&mut length_bytes)?;

    let message_length = u32::from_ne_bytes(length_bytes) as usize;
    let mut buffer = vec![0; message_length];

    // Implement a loop to read data until timeout or message is fully received
    while start_time.elapsed() < timeout_duration {
        match io::stdin().read_exact(&mut buffer) {
            Ok(_) => {
                let result_str = String::from_utf8(buffer)
                    .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "Could not convert to UTF-8"))?;
                println!("Read input: {}", result_str);
                return Ok(result_str);
            }
            Err(e) if e.kind() == io::ErrorKind::UnexpectedEof => {
                // Continue the loop if UnexpectedEof occurs
                continue;
            }
            Err(e) => {
                // Handle other IO errors
                return Err(e);
            }
        }
    }

    // Handle timeout
    println!("Timeout while reading input");
    Err(io::Error::new(io::ErrorKind::TimedOut, "Timeout while reading input"))
}

/// Read input from stdin as a String.
pub fn read_input() -> io::Result<String> {
    let mut instream = io::stdin();
    let mut length = [0; 4];
    instream.read(&mut length)?;
    let mut buffer = vec![0; u32::from_ne_bytes(length) as usize];
    instream.read_exact(&mut buffer)?;
    let result_str = String::from_utf8(buffer).map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "Could not convert to UTF-8"))?;
    Ok(result_str)
}


/// Write the output message to stdout.
pub fn write_output(msg: &str) -> io::Result<()> {
    let mut outstream = io::stdout();
    let len = msg.len();
    if len > 1024 * 1024 {
        panic!("Message was too large, length: {}", len)
    }
    outstream.write(&len.to_ne_bytes())?;
    outstream.write_all(msg.as_bytes())?;
    outstream.flush()?;
    Ok(())
}

#[derive(Debug, Deserialize)]
struct RawInputData {
    #[serde(rename = "type")]
    action_type: String,
    payload: Option<Value>,
}
/// Parse input string into InputData.
pub fn parse_input(input: &str) -> Result<InputData, &'static str> {
    // Deserialize the JSON string into the intermediate structure
    let intermediate: RawInputData = serde_json::from_str(input)
        .map_err(|_| "Could not deserialize input JSON")?;

    // Determine the action to be performed based on the "type" field
    let action: Action = match intermediate.action_type.as_str() {
        "key_click" => {
            if let Some(Value::String(key_str)) = intermediate.payload {
                if let Some(key) = key_str.chars().next() {
                    Action::KeyClick { key }
                } else {
                    return Err("Empty string for key_click");
                }
            } else {
                return Err("Payload for key_click must be a string");
            }
        },
        "mouse_click" => {
            let x = intermediate.payload.as_ref().and_then(|p| p.get("x").and_then(Value::as_i64).map(|x| x as i32));
            let y = intermediate.payload.as_ref().and_then(|p| p.get("y").and_then(Value::as_i64).map(|y| y as i32));
            Action::MouseClick { x, y }
        },
        _ => return Err("Invalid action type")
    };

    Ok(InputData { action })
}

/// Handle the input data and perform actions.
/// Handles the input command and performs actions like key presses or mouse clicks.
/// Returns a JSON-formatted string indicating the status and message of the operation.
pub fn handle_input(input: InputData) -> (&'static str, String) {
     match input.action {
        Action::KeyClick { key } => {
            press_key(key);
            ("ok", "key_clicked".to_string())
        }
        Action::MouseClick { x, y } => {
            click_mouse(x, y);
            ("ok", "mouse_clicked".to_string())
        }
    }
}
