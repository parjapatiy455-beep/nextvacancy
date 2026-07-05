import { JobForm } from '@/components/job-form';

export default function NewJobPage() {
  return (
    <div className="p-6">
      <JobForm isEditing={false} />
    </div>
  );
}
