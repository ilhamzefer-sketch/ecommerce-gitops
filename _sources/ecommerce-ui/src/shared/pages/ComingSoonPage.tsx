import { Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { StatusPill } from "../ui/StatusPill";

export function ComingSoonPage() {
  return (
    <main className="page-shell page-shell--narrow" aria-labelledby="soon-title">
      <Card className="coming-soon">
        <Clock3 size={34} aria-hidden="true" />
        <StatusPill label="Tezliklə" tone="warning" />
        <h1 id="soon-title">Bu bölmə hələ aktiv deyil</h1>
        <p>
          Marketplace funksiyaları üçün backend endpointləri hazır olmadığına görə bu səhifədə məhsul, kateqoriya,
          sifariş və ya digər saxta məlumat göstərilmir.
        </p>
        <Link className="text-link" to="/account">
          Hesab səhifəsinə qayıt
        </Link>
      </Card>
    </main>
  );
}
