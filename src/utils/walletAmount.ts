export const MIN_WALLET_ADD_AMOUNT = 100;
export const MAX_WALLET_ADD_AMOUNT = 50000;

export const validateWalletAddAmount = (value: unknown): string | null => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) return "Please enter a valid amount.";
    if (!Number.isInteger(amount)) return "Amount must be a whole number.";
    if (amount < MIN_WALLET_ADD_AMOUNT) return `Minimum amount is ₹${MIN_WALLET_ADD_AMOUNT}.`;
    if (amount > MAX_WALLET_ADD_AMOUNT) return `Maximum amount is ₹${MAX_WALLET_ADD_AMOUNT}.`;
    return null;
};