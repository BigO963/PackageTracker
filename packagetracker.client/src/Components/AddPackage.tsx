// AddPackageDialog.tsx
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type AddPackageDialogProps = {
    open?: boolean;
    onClose?: () => void;
    onPackageAdded?: () => Promise<void> | void;
};
export default function AddPackage({ onPackageAdded }: AddPackageDialogProps) {
    const [open, setOpen] = useState(false);

    const [senderName, setSenderName] = useState("");
    const [senderAddress, setSenderAddress] = useState("");
    const [senderPhone, setSenderPhone] = useState("");

    const [recipientName, setRecipientName] = useState("");
    const [recipientAddress, setRecipientAddress] = useState("");
    const [recipientPhone, setRecipientPhone] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successOpen, setSuccessOpen] = useState(false);

    // simple client-side validation
    const isValid =
        senderName.trim() &&
        senderAddress.trim() &&
        senderPhone.trim() &&
        recipientName.trim() &&
        recipientAddress.trim() &&
        recipientPhone.trim();

    async function handleSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        if (!isValid) {
            setError("Please fill in all fields.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                sender: {
                    senderName: senderName.trim(),
                    senderAddress: senderAddress.trim(),
                    senderPhone: senderPhone.trim(),
                },
                recipient: {
                    recipientName: recipientName.trim(),
                    recipientAddress: recipientAddress.trim(),
                    recipientPhone: recipientPhone.trim(),
                },
                // default status and createdAt
                status: "Created",
                createdAt: new Date().toISOString(),
            };

            const resp = await fetch("/api/packages/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!resp.ok) {
                const text = await resp.text().catch(() => "");
                throw new Error(text || `Server returned ${resp.status} ${resp.statusText}`);
            }

            // success
            setSuccessOpen(true);
            setOpen(false);

            // reset form
            setSenderName("");
            setSenderAddress("");
            setSenderPhone("");
            setRecipientName("");
            setRecipientAddress("");
            setRecipientPhone("");

            if (onPackageAdded) {
                try {
                    await onPackageAdded();
                } catch {

                }
            }
        } catch (err: any) {
            console.error("Failed to create package:", err);
            setError(err?.message || "Failed to create package");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Tooltip title="Add new package">
                <IconButton color="primary" onClick={() => setOpen(true)} aria-label="add-package">
                    <AddIcon />
                    Add Package
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add new package</DialogTitle>

                <DialogContent dividers>
                    <form id="add-package-form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <strong>Sender</strong>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Sender name"
                                    value={senderName}
                                    onChange={(e) => setSenderName(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Sender phone"
                                    value={senderPhone}
                                    onChange={(e) => setSenderPhone(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Sender address"
                                    value={senderAddress}
                                    onChange={(e) => setSenderAddress(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid size={12} style={{ marginTop: 8 }}>
                                <strong>Recipient</strong>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Recipient name"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Recipient phone"
                                    value={recipientPhone}
                                    onChange={(e) => setRecipientPhone(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Recipient address"
                                    value={recipientAddress}
                                    onChange={(e) => setRecipientAddress(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            {error && (
                                <Grid size={12}>
                                    <Alert severity="error">{error}</Alert>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={submitting}>
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="add-package-form"
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!isValid || submitting}
                        startIcon={submitting ? <CircularProgress size={18} /> : undefined}
                    >
                        {submitting ? "Creating…" : "Create package"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" onClose={() => setSuccessOpen(false)}>
                    Package created
                </Alert>
            </Snackbar>
        </>
    );
}
