import { Suspense } from "react";
import ConfigDirector, { ConfigDirectorLoading } from "./config-director";
import ConfigPeriod, { ConfigPeriodLoading } from "./config-period";

export default function ConfigGeneral() {
  // TODO: use prefecth with dehydration api for director and period
  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <Suspense fallback={<ConfigDirectorLoading />}>
        <ConfigDirector />
      </Suspense>
      <Suspense fallback={<ConfigPeriodLoading />}>
        <ConfigPeriod />
      </Suspense>
    </div>
  );
}
