import { Suspense } from "react";
import ConfigDirector, { ConfigDirectorLoading } from "./config-director";
import ConfigPeriod, { ConfigPeriodLoading } from "./config-period";

export default function ConfigGeneral() {
  // TODO: use prefecth with dehydration api for director and period
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
