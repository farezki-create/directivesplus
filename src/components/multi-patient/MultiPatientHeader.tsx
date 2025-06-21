
interface MultiPatientHeaderProps {
  className?: string;
}

export default function MultiPatientHeader({ className = "" }: MultiPatientHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
        Suivi Multi-Patients
      </h1>
      <p className="text-gray-600 text-lg">
        Surveillez et analysez les symptômes de tous vos patients
      </p>
    </div>
  );
}
