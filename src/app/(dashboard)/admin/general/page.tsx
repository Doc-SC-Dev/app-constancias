import { Suspense } from "react";
import ConfigDirector, {
  ConfigDirectorLoading,
} from "./_components/config-director";
import ConfigPeriod, { ConfigPeriodLoading } from "./_components/config-period";

export default function ConfigGeneral() {
  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <h1 className="text-2xl">Director del Programa</h1>
      <Suspense fallback={<ConfigDirectorLoading />}>
        <ConfigDirector />
      </Suspense>
      <h1 className="text-2xl">Periodos Académicos</h1>
      <Suspense fallback={<ConfigPeriodLoading />}>
        <ConfigPeriod />
      </Suspense>
    </div>
  );
}
