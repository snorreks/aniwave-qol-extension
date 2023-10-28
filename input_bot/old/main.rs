use input_bot::*;
/*
to test run this:
echo "{\"type\": \"mouse_click\", \"payload\": {\"x\": 100, \"y\": 200 }}" | cargo run
*/

fn run() -> (&'static str, String) {
    let input_str = match read_input() {
        Ok(str) => str,
        Err(err) => return ("error", format!("Error reading input: {}", err)),
    };

    let parsed_input_result = parse_input(&input_str);
    
    match parsed_input_result {
        Ok(parsed_input) => handle_input(parsed_input),
        Err(err_msg) => ("error", err_msg.to_string()),
    }
}

fn main() {
    let (status, msg) = run();

    let output = format!("{{\"status\":\"{}\", \"msg\":\"{}\"}}", status, msg);
    write_output(&output).unwrap();
}