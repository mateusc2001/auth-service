enum LogLevelString {
    Trace = "Trace-Level",
    Debug = "Debug-Level",
}
const exists = (value: string) => Object.values(LogLevelString).includes(value as any);
console.log(exists("Debug-Level"));
// true
console.log(exists("Undefined-Level"));
// false