
import { SharedAccessPage } from "@/components/shared-access/SharedAccessPage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SharedAccessPageContainer() {
  return (
    <>
      <Header />
      <main>
        <SharedAccessPage />
      </main>
      <Footer />
    </>
  );
}
