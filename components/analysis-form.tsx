"use client"

interface AnalysisFormProps {
  fastaSequence: string
  onSequenceChange: (sequence: string) => void
}

export default function AnalysisForm({ fastaSequence, onSequenceChange }: AnalysisFormProps) {
  return <div className="space-y-4">{/* This component can be expanded for more complex form logic */}</div>
}
