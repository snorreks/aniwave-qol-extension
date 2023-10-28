use input_bot::*;

fn main() {
    // Simulate receiving JSON data from JavaScript
    let json_data = r#"{
        "type": "mouse_click",
        "payload": {"x": 100, "y": 200 }
    }"#;
    let parsed_input_result = parse_input(&json_data);
    
    let (status, msg) = match parsed_input_result {
        Ok(parsed_input) => handle_input(parsed_input),
        Err(err_msg) => ("error", err_msg.to_string()),
    };
    let output = format!("{{\"status\":\"{}\", \"msg\":\"{}\"}}", status, msg);

    println!("Response: {}", output);
}
