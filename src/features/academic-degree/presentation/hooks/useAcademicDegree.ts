"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateAcademicDegreeInput,
  UpdateAcademicDegreeInput,
} from "../../domain/AcademicDegree";
import {
  createAcademicDegreeAction,
  deleteAcademicDegreeAction,
  updateAcademicDegreeAction,
} from "../actions";

export function useAcademicDegree() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["get-all-academic-degree-paginated"],
    });
  };

  const create = async (data: CreateAcademicDegreeInput) => {
    const result = await createAcademicDegreeAction(data);
    if (result.isSuccess) {
      toast.success("Grado académico creado exitosamente");
      invalidate();
    } else {
      toast.error(result.error || "Error al crear el grado académico");
    }
    return result;
  };

  const update = async (data: UpdateAcademicDegreeInput) => {
    const result = await updateAcademicDegreeAction(data);
    if (result.isSuccess) {
      toast.success("Grado académico actualizado exitosamente");
      invalidate();
    } else {
      toast.error(result.error || "Error al actualizar el grado académico");
    }
    return result;
  };

  const remove = async (id: string) => {
    const result = await deleteAcademicDegreeAction(id);
    if (result.isSuccess) {
      toast.success("Grado académico eliminado exitosamente");
      invalidate();
    } else {
      toast.error(result.error || "Error al eliminar el grado académico");
    }
    return result;
  };

  return { create, update, remove };
}
