"use client";

import { useState } from "react";
import { AlertCircle, Mail, Paperclip } from "lucide-react";
import { LEGAL } from "@/config/legal";

/**
 * The dispute submission form.
 *
 * There is no backend behind this yet. Rather than POST to an endpoint that does
 * not exist, or show a "we have received your dispute" screen that is not true,
 * the form validates what was typed and hands it to the reader's email client
 * addressed to the Grievance Officer — a mailbox that is monitored today. That is
 * the only route on this page that genuinely reaches a human, so it is the one
 * the form uses, and the note above it says so plainly.
 *
 * Attachments work the same way: the browser cannot attach a file to a mailto,
 * so the chosen filenames are listed in the body and the reader is asked to
 * attach them to the same email.
 *
 * TODO(crux-dispute-intake): replace the mailto fallback with a real submission
 * once the intake exists — POST the fields and the uploads to
 * `/api/crux/disputes`, which should write one `crux_disputes` row (project id,
 * submitter name, email, relationship, statement, uploaded file refs, status,
 * reference number, timestamps), rate-limit by IP and email, virus-scan every
 * upload, and return the reference number this page then shows. The "Under
 * review" chip on the project page reads the same row. Until all of that is
 * built, do not swap in a fake success state.
 */

const RELATIONSHIPS = [
  "Developer or promoter",
  "Authorised representative",
  "Allottee",
  "Named or identifiable in the information shown",
] as const;

interface Fields {
  project: string;
  name: string;
  email: string;
  relationship: string;
  statement: string;
}

type FieldName = keyof Fields;

const EMPTY: Fields = {
  project: "",
  name: "",
  email: "",
  relationship: "",
  statement: "",
};

const LABELS: Record<FieldName, string> = {
  project: "Project",
  name: "Your name",
  email: "Email we can reply to",
  relationship: "Your relationship to the project",
  statement: "What is wrong, and what the correct position is",
};

/** Deliberately permissive: this only catches an address that cannot work. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(fields: Fields): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!fields.project.trim()) errors.project = "Tell us which project this is about.";
  if (!fields.name.trim()) errors.name = "Tell us who you are.";
  if (!fields.email.trim()) errors.email = "We need an address to reply to.";
  else if (!EMAIL.test(fields.email.trim())) errors.email = "That does not look like an email address.";
  if (!fields.relationship) errors.relationship = "Tell us how you are connected to the project.";
  if (!fields.statement.trim())
    errors.statement = "Tell us exactly what is wrong, and what the correct position is.";
  return errors;
}

function buildMailto(fields: Fields, filenames: string[]): string {
  const lines = [
    `Project: ${fields.project.trim()}`,
    `Submitted by: ${fields.name.trim()}`,
    `Relationship to the project: ${fields.relationship}`,
    `Reply to: ${fields.email.trim()}`,
    "",
    "What is wrong, and what the correct position is:",
    fields.statement.trim(),
    "",
    filenames.length > 0
      ? `Documents to attach: ${filenames.join(", ")}\n(Please attach these files to this email before sending.)`
      : "Documents: none attached.",
  ];
  const subject = `CRUX dispute — ${fields.project.trim()}`;
  return `mailto:${LEGAL.grievanceEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(lines.join("\n"))}`;
}

const FIELD_BASE =
  "w-full rounded-xl border bg-white px-4 text-[15px] text-crux-text-primary outline-none transition-colors duration-200 motion-reduce:transition-none placeholder:text-crux-text-muted focus-visible:border-crux-green focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 focus-visible:outline-none";

function fieldClass(hasError: boolean, extra: string): string {
  return `${FIELD_BASE} ${extra} ${hasError ? "border-red-400" : "border-crux-border hover:border-crux-text-muted"}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] text-red-600">
      <AlertCircle size={14} strokeWidth={2} aria-hidden className="shrink-0" />
      {message}
    </p>
  );
}

export default function DisputeForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [filenames, setFilenames] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [handedOff, setHandedOff] = useState(false);

  const set = (field: FieldName) => (value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);

    const firstInvalid = (Object.keys(LABELS) as FieldName[]).find((field) => found[field]);
    if (firstInvalid) {
      setHandedOff(false);
      document.getElementById(`dispute-${firstInvalid}`)?.focus();
      return;
    }

    setHandedOff(true);
    window.location.href = buildMailto(fields, filenames);
  }

  return (
    <section id="submit-a-dispute" aria-labelledby="submit-a-dispute-heading" className="mt-16 scroll-mt-24">
      <h2
        id="submit-a-dispute-heading"
        className="text-pretty text-[20px] font-bold leading-snug tracking-[-0.01em] text-crux-text-primary md:text-[22px]"
      >
        Submit a dispute
      </h2>

      {/* The honest note. The form does not store anything yet, and saying so is
          cheaper than a reader believing a filing has been received. */}
      <p className="mt-4 rounded-2xl border border-crux-green/25 bg-crux-bg-accent p-5 text-[15px] leading-[1.7] text-crux-text-primary">
        <Mail size={16} strokeWidth={1.75} aria-hidden className="mr-2 inline-block align-[-3px] text-crux-green-dark" />
        This form does not upload anything yet. It opens an email to{" "}
        <a
          href={`mailto:${LEGAL.grievanceEmail}`}
          className="font-medium text-crux-green-dark underline decoration-crux-green/40 underline-offset-[3px] hover:text-crux-green-mid rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2"
        >
          {LEGAL.grievanceEmail}
        </a>{" "}
        with everything you type below already filled in — a mailbox a person
        reads. Attach your documents to that email before you send it. The 2
        working day acknowledgement runs from when it arrives.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor="dispute-project" className="block text-[13px] font-semibold text-crux-text-primary">
            {LABELS.project}
          </label>
          <p id="dispute-project-hint" className="mt-1 text-[13px] text-crux-text-muted">
            The project name, or its GujRERA registration number.
          </p>
          <input
            id="dispute-project"
            name="project"
            type="text"
            value={fields.project}
            onChange={(event) => set("project")(event.target.value)}
            aria-invalid={Boolean(errors.project)}
            aria-describedby={errors.project ? "dispute-project-error" : "dispute-project-hint"}
            className={fieldClass(Boolean(errors.project), "mt-2 h-12")}
          />
          <FieldError id="dispute-project-error" message={errors.project} />
        </div>

        <div>
          <label htmlFor="dispute-name" className="block text-[13px] font-semibold text-crux-text-primary">
            {LABELS.name}
          </label>
          <input
            id="dispute-name"
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(event) => set("name")(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "dispute-name-error" : undefined}
            className={fieldClass(Boolean(errors.name), "mt-2 h-12")}
          />
          <FieldError id="dispute-name-error" message={errors.name} />
        </div>

        <div>
          <label htmlFor="dispute-email" className="block text-[13px] font-semibold text-crux-text-primary">
            {LABELS.email}
          </label>
          <input
            id="dispute-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={fields.email}
            onChange={(event) => set("email")(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "dispute-email-error" : undefined}
            className={fieldClass(Boolean(errors.email), "mt-2 h-12")}
          />
          <FieldError id="dispute-email-error" message={errors.email} />
        </div>

        <div>
          <label htmlFor="dispute-relationship" className="block text-[13px] font-semibold text-crux-text-primary">
            {LABELS.relationship}
          </label>
          <select
            id="dispute-relationship"
            name="relationship"
            value={fields.relationship}
            onChange={(event) => set("relationship")(event.target.value)}
            aria-invalid={Boolean(errors.relationship)}
            aria-describedby={errors.relationship ? "dispute-relationship-error" : undefined}
            className={fieldClass(Boolean(errors.relationship), "mt-2 h-12 appearance-none")}
          >
            <option value="">Select one</option>
            {RELATIONSHIPS.map((relationship) => (
              <option key={relationship} value={relationship}>
                {relationship}
              </option>
            ))}
          </select>
          <FieldError id="dispute-relationship-error" message={errors.relationship} />
        </div>

        <div>
          <label htmlFor="dispute-statement" className="block text-[13px] font-semibold text-crux-text-primary">
            {LABELS.statement}
          </label>
          <p id="dispute-statement-hint" className="mt-1 text-[13px] text-crux-text-muted">
            Quote the statement you are disputing, say what the record actually
            says, and name the document that shows it.
          </p>
          <textarea
            id="dispute-statement"
            name="statement"
            rows={7}
            value={fields.statement}
            onChange={(event) => set("statement")(event.target.value)}
            aria-invalid={Boolean(errors.statement)}
            aria-describedby={
              errors.statement ? "dispute-statement-error" : "dispute-statement-hint"
            }
            className={fieldClass(Boolean(errors.statement), "mt-2 min-h-[11rem] py-3 leading-[1.7]")}
          />
          <FieldError id="dispute-statement-error" message={errors.statement} />
        </div>

        <div>
          <label htmlFor="dispute-documents" className="block text-[13px] font-semibold text-crux-text-primary">
            Documents
          </label>
          <p id="dispute-documents-hint" className="mt-1 text-[13px] text-crux-text-muted">
            Optional. Choosing files here only lists their names in the email —
            attach the files themselves before you send it.
          </p>
          <input
            id="dispute-documents"
            name="documents"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            aria-describedby="dispute-documents-hint"
            onChange={(event) =>
              setFilenames(Array.from(event.target.files ?? []).map((file) => file.name))
            }
            className="mt-2 block w-full cursor-pointer rounded-xl border border-crux-border bg-white p-2.5 text-[14px] text-crux-text-secondary file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-lg file:border-0 file:bg-crux-bg-secondary file:px-4 file:text-[13px] file:font-semibold file:text-crux-text-primary hover:border-crux-text-muted focus-visible:border-crux-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2"
          />
          {filenames.length > 0 && (
            <ul className="mt-2 flex list-none flex-col gap-1 p-0">
              {filenames.map((filename) => (
                <li key={filename} className="flex items-center gap-1.5 text-[13px] text-crux-text-secondary">
                  <Paperclip size={13} strokeWidth={2} aria-hidden className="shrink-0" />
                  {filename}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-crux-green px-6 text-[15px] font-semibold text-crux-ink shadow-[var(--shadow-premium-md)] transition-colors duration-200 motion-reduce:transition-none hover:bg-crux-green-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crux-green focus-visible:ring-offset-2 sm:w-auto sm:self-start"
        >
          Open this in an email
        </button>

        {/* Not a success message: nothing has been received, and the only thing
            this page knows is that it asked the browser to open a mail client. */}
        <p role="status" className="min-h-[1.25rem] text-[13px] leading-[1.6] text-crux-text-muted">
          {handedOff
            ? `Your email client should have opened with these details filled in. Nothing has been sent or stored yet — check the message, attach your documents, and send it. If nothing opened, write to ${LEGAL.grievanceEmail} directly.`
            : ""}
        </p>
      </form>
    </section>
  );
}
