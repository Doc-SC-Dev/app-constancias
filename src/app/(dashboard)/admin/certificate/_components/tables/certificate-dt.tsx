"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { LazyDataTable } from "@/components/dynamic-table";
import LinkActionButton from "@/components/link-action-button";
import { TableCell } from "@/components/table-cell";
import type { CertificatePaginated } from "@/lib/types/certificate";
import { formatDate } from "@/lib/utils";
import DeleteCertificateAlertDialog from "../../[id]/_components/delete-certificate-alert-dialog";
import { getPaginatedCertificates } from "../../actions";
import CreateCertificateDialog from "../dialogs/create-certificate-dialog";

const columns: ColumnDef<CertificatePaginated>[] = [
  { accessorKey: "name", header: "Nombre" },
  {
    accessorKey: "templates",
    header() {
      return <TableCell className="justify-center">Plantillas</TableCell>;
    },
    cell(props) {
      return (
        <TableCell className="justify-center">
          {props.getValue<number>()}
        </TableCell>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header() {
      return (
        <TableCell className="justify-center">Fecha de creación</TableCell>
      );
    },
    cell(props) {
      return (
        <TableCell className="justify-center">
          {formatDate(props.getValue<Date>())}
        </TableCell>
      );
    },
  },
  {
    id: "actions",
    header() {
      return <TableCell className="justify-center">Acción</TableCell>;
    },
    cell(props) {
      const cert = props.row.original;
      return (
        <TableCell className="justify-center">
          <LinkActionButton
            seeLink={`/admin/certificate/${cert.id}`}
            editLink={`/admin/certificate/${cert.id}/edit`}
            deleteAlertDialog={() => (
              <DeleteCertificateAlertDialog certificate={cert} />
            )}
          />
        </TableCell>
      );
    },
  },
];

export default function CertificateDT() {
  return (
    <LazyDataTable
      queryKey="get-paginated-certificate"
      queryFn={getPaginatedCertificates}
      columns={columns}
      emptyTitle="No se ha creado ningún certificado"
      emptyDescription="Cree un nuevo certificado para verlo en esta vista"
      placeholder="Filtrar certificados"
      createDialog={CreateCertificateDialog}
    />
  );
}
