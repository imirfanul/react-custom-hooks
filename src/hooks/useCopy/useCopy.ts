import { useState, useEffect } from "react";

type CopiedValue = string | object | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success
type CopyState = boolean;
function useCopy(resetInterval: null): [CopiedValue, CopyFn, CopyState] {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);
    const [isCopied, setCopied] = useState(false);

    const handleCopy: CopyFn = async (text) => {
        if (!navigator?.clipboard) {
            console.warn("Clipboard not supported");
            return false;
        }
        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            setCopied(true);
            return true;
        } catch (error) {
            setCopied(false);
            console.error("Copy failed", error);
            setCopiedText(null);
            return false;
        }
    };
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (isCopied && resetInterval) {
            timeout = setTimeout(() => setCopied(false), resetInterval);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [isCopied, resetInterval]);

    return [copiedText, handleCopy, isCopied];
}

export default useCopy;
