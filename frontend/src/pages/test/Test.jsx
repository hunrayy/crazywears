import { useTestHook } from "./useTestHook";

export default function Test() {
    const result = useTestHook();

    console.log(result);

    return <h1>Test</h1>;
}