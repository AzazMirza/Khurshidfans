"use client";

import React from "react";
import { Label } from "@/components/ui/labels";
import { Input } from "@/components/ui/inputs";
import { cn } from "@/lib/utils";

export default function Page() {
  const [resume, setResume] = React.useState<File | null>(null);
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!resume) {
      setError("Please upload your resume");
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setError("Resume size must be under 5MB");
      return;
    }

    console.log("Job application submitted");
  };

  return (
    <div className="shadow-input mt-30 mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 dark:bg-black">
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
        Join Us
      </h2>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        Please fill in the details below to apply for the job.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* ================= PERSONAL INFORMATION ================= */}
        <SectionTitle title="Personal Information" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LabelInputContainer>
            <Label>First Name :</Label>
            <Input placeholder="Enter your first name" />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label>Last Name :</Label>
            <Input placeholder="Enter your last name" />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mt-4">
          <Label>Guardian Name :</Label>
          <Input placeholder="Enter guardian name" />
        </LabelInputContainer>
        

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <LabelInputContainer>
            <Label>Address:</Label>
            <Input placeholder="Enter address" />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label>CNIC Number :</Label>
            <Input placeholder="XXXXX-XXXXXXX-X" />
          </LabelInputContainer>
        </div>

        {/* ================= QUALIFICATION ================= */}
        <SectionTitle title="Education" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LabelInputContainer>
            <Label>Qualification :</Label>
            <Input placeholder="e.g. BS, MS, Intermediate" />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label>Marks / CGP:</Label>
            <Input placeholder="e.g. 3.2 / 80%" />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mt-4">
          <Label>Field :</Label>
          <Input placeholder="e.g. Computer Science" />
        </LabelInputContainer>

        <LabelInputContainer className="mt-4">
          <Label> Institute :</Label>
          <Input placeholder="Enter university name" />
        </LabelInputContainer>

        {/* ================= EXPERIENCE ================= */}
        <SectionTitle title="Experience" />

        <LabelInputContainer>
          <Label>Add Experience :</Label>
          <textarea
            rows={4}
            placeholder="Describe your work experience here..."
            className="rounded-md border border-neutral-300 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-black"
          />
        </LabelInputContainer>

        {/* ================= RESUME UPLOAD ================= */}
        <SectionTitle title="Add Resume" />

        <LabelInputContainer>
  <Label htmlFor="resume">Upload Resume :</Label>

  <label
    htmlFor="resume"
    className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 text-center hover:bg-neutral-100 dark:border-neutral-700 dark:bg-zinc-900"
  >
    {resume ? (
      // If file is uploaded, show file inside box
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">
          {resume.name}
        </span>
        <span className="text-xs text-neutral-500">
          {Math.round(resume.size / 1024)} KB
        </span>
      </div>
    ) : (
      // Default content if no file
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="text-sm text-neutral-600 dark:text-neutral-300">
          Click to upload or drag & drop
        </span>
        <span className="text-xs text-neutral-500">
          PDF, DOC, DOCX (Max 5MB)
        </span>
      </div>
    )}
  </label>

  <Input
    id="resume"
    type="file"
    accept=".pdf,.doc,.docx"
    className="hidden"
    onChange={(e) => setResume(e.target.files?.[0] || null)}
  />
</LabelInputContainer>


        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-[var(--gold-btn-color)] py-2 text-black transition hover:bg-[var(--gold-btn-hover)]"
        >
          Apply Now
        </button>
      </form>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="mb-4 mt-8 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
    {title}
  </h3>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
