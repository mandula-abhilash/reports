import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function MapLoading() {
  return (
    <Card className="h-full w-full flex items-center justify-center">
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    </Card>
  );
}
