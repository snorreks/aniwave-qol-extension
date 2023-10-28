use input_bot::*;
use chrome_native_messaging::event_loop;
use serde::Serialize;
use serde_json::Value;

#[derive(Serialize)]
struct ResponseData {
    status: String,
    message: String,
}

fn main() {
    event_loop::<ResponseData, &'static str, _>(|value| {
        match value {
            Value::Null => Ok(ResponseData { status: "error".to_string(), message: "null payload".to_string() }),
            _ => {
                let parsed_input_result = parse_input(&serde_json::to_string(&value).unwrap());

                match parsed_input_result {
                    Ok(parsed_input) => {
                        let (status, msg) = handle_input(parsed_input);
                        Ok(ResponseData { status: status.to_string(), message: msg.to_string() })
                    }
                    Err(err_msg) => Ok(ResponseData { status: "error".to_string(), message: format!("error: {}", err_msg) }),
                }
            }
        }
    });
}
