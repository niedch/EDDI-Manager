import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { AddExtensionDialog } from "@/components/editors/add-extension-dialog";

describe("AddExtensionDialog — RAG task", () => {
  it("shows RAG in the extension type list", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();

    renderWithProviders(
      <AddExtensionDialog open={true} onSelect={onSelect} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("ext-option-ai.labs.rag")).toBeInTheDocument();
    });
  });

  it("transitions to pick-resource step and lists existing RAG configs", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <AddExtensionDialog open={true} onSelect={onSelect} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("ext-option-ai.labs.rag")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("ext-option-ai.labs.rag"));

    await waitFor(() => {
      expect(screen.getByTestId("create-new-config")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Product Knowledge Base")).toBeInTheDocument();
      expect(screen.getByText("Legal Document Store")).toBeInTheDocument();
      expect(screen.getByText("Employee Handbook")).toBeInTheDocument();
    });
  });

  it("selects an existing RAG resource and calls onSelect", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <AddExtensionDialog open={true} onSelect={onSelect} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("ext-option-ai.labs.rag")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("ext-option-ai.labs.rag"));

    await waitFor(() => {
      expect(screen.getByText("Product Knowledge Base")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Product Knowledge Base"));

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledTimes(1);
      const result = onSelect.mock.calls[0][0];
      expect(result.descriptor.type).toBe("ai.labs.rag");
      expect(result.configUri).toContain("ragstore/rags/rag1");
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("creates a new empty RAG config and calls onSelect", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <AddExtensionDialog open={true} onSelect={onSelect} onClose={onClose} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("ext-option-ai.labs.rag")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("ext-option-ai.labs.rag"));

    await waitFor(() => {
      expect(screen.getByTestId("create-new-config")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("create-new-config"));

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledTimes(1);
      const result = onSelect.mock.calls[0][0];
      expect(result.descriptor.type).toBe("ai.labs.rag");
      expect(result.configUri).toContain("eddi://ai.labs.rag/ragstore/rags/");
    });
  });
});
