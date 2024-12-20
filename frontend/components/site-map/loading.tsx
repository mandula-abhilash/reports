import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function MapLoading() {
  return (
    <Card className="h-full w-full rounded-md flex items-center justify-center">
      <Spinner size="lg" className="text-web-orange" />
    </Card>
  );
}
