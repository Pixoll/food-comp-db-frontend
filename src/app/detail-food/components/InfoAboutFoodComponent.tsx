import {Origin} from "../../../core/types/SingleFoodResult";

type InfoAboutFoodComponentProps = {
    ingredients: Partial<Record<"es" | "en" | "pt", string>>;
    group: {
        code: string;
        name: string;
    };
    type: {
        code: string;
        name: string;
    };
    scientificName?: string;
    subspecies?: string;
    strain?: string;
    brand?: string;
    observation?: string;
    origins?: Origin[];
}

export default function InfoAboutFoodComponent({ data }: { data: InfoAboutFoodComponentProps }) {

    return (
        <div className="bg-[white] rounded-[8px] shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] p-[18px]">
            <h3 className="text-[14px] font-[600] text-gray-800 mb-[16px]">Información del alimento</h3>

            <div className="flex flex-col md:flex-row gap-[32px]">
                <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 gap-y-2">
                        {data.brand && (
                            <div className="flex flex-col">
                                <span className="text-[14px] font-[500] text-gray-500">Marca</span>
                                <span className="text-gray-800">{data.brand}</span>
                            </div>
                        )}

                        {data.scientificName && (
                            <div className="flex flex-row">
                                <span className="text-[14px] font-[500] text-gray-500">Nombre científico: </span>
                                <span className="text-gray-800 italic">{data.scientificName}</span>
                            </div>
                        )}

                        {data.group && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Grupo</span>
                                <span className="text-gray-800">{data.group.name} <span className="text-xs text-gray-500">({data.group.code})</span></span>
                            </div>
                        )}

                        {data.type && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Tipo</span>
                                <span className="text-gray-800">{data.type.name} <span className="text-xs text-gray-500">({data.type.code})</span></span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 gap-y-2">
                        {data.subspecies && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Variante</span>
                                <span className="text-gray-800">{data.subspecies}</span>
                            </div>
                        )}

                        {data.strain && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Cepa</span>
                                <span className="text-gray-800">{data.strain}</span>
                            </div>
                        )}

                        {data.observation && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500">Observación</span>
                                <span className="text-gray-800">{data.observation}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {data.origins && data.origins.length > 0 && (
                <div className="mt-[24px] pt-[16px] border-t-[1px] border-gray-100">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Orígenes</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.origins.map((origin) => (
                            <span
                                key={origin.id}
                                className="px-[12px] py-[4px] bg-gray-100 text-gray-700 rounded-[50%] text-sm"
                            >
                {origin.name}
              </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
