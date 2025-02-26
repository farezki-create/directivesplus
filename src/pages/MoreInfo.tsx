
import { HASPDFViewer } from "@/components/pdf/HASPDFViewer";

export default function MoreInfo() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">En savoir plus</h2>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <HASPDFViewer />
        </div>
      </div>
    </div>
  );
}
