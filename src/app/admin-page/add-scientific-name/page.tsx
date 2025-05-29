'use client'
import { useScientificNames } from "@/hooks";
import { useState } from "react";

export default function AddScientificNamePage() {

    const {idToObject} = useScientificNames();
    const [searchTerm, setSearchTerm] = useState("");
    const [newScientificName, setNewScientificName] = useState("");

    const scientificNames =idToObject.mapValues(s => ({ id: s.id, name: s.name }));

    const filteredScientificNames = searchTerm
        ? scientificNames.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : scientificNames;

    return (
        <div className="h-auto bg-gradient-to-b from-[#f1faf6] to-[#ace5e1] p-[24px]">
            <div className="max-w-[1000px] bg-[#ffffff] mx-auto rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="bg-[#33ae90] text-[#ffffff] p-[24px]">
                    <h1 className="text-[28px] font-[700] text-center">Agregar Nuevo Nombre Cientifico</h1>
                    <p className="text-[16px] opacity-[0.9] text-center mt-[8px]">
                        Agrega o busca nombres cientificos en el sistema
                    </p>
                </div>

                <div className="p-[32px]">
                    <div className="mb-[32px]">
                        <h2 className="text-[20px] font-[600] text-[#1f2937] mb-[16px]">Buscar nombres cientificos existentes</h2>

                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar subespecies..."
                                className="w-full p-[12px] pl-[44px] border-[2px] border-[#e5e7eb] rounded-[8px] focus:border-[#166534] focus:outline-none transition-all duration-[200ms]"
                            />
                            <div className="absolute left-[16px] top-[50%] translate-y-[-50%] text-[#9ca3af]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[20px] h-[20px]">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-[20px] max-h-[300px] overflow-y-auto pr-[8px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                                {filteredScientificNames.size > 0 ? (
                                    filteredScientificNames.map((s) => (
                                        <div key={s.id} className="p-[16px] border-[1px] border-[#e5e7eb] rounded-[8px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-[#336bae] transition-all duration-[200ms] cursor-pointer">
                                            <p className="font-[500] text-[#1f2937]">{s.name}</p>
                                            <p className="text-[14px] text-[#6b7280] mt-[4px]">ID: {s.id}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center p-[20px] text-[#6b7280]">
                                        {searchTerm ? "No se encontraron subespecies" : "Cargando subespecies..."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-[32px] pt-[32px] border-t-[1px] border-[#e5e7eb]">
                        <h2 className="text-[20px] font-[600] text-[#1f2937] mb-[16px]">Agregar nuevo nombre cientifico.</h2>

                        <div className="mb-[20px]">
                            <input
                                type="text"
                                value={newScientificName}
                                onChange={(e) => setNewScientificName(e.target.value)}
                                placeholder="Nombre de la nueva subespecie..."
                                className="w-full p-[12px] border-[2px] border-[#e5e7eb] rounded-[8px] focus:border-[#166534] focus:outline-none transition-all duration-[200ms] mb-[16px]"
                            />

                            <div className="flex flex-wrap gap-[16px]">
                                <button
                                    className="flex items-center bg-[#f1faf6] text-[#336bae] border-[1px] border-[#336bae] py-[10px] px-[20px] rounded-[6px] font-[500] hover:bg-[#accbf0] transition-colors duration-[200ms]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[18px] h-[18px] mr-[8px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verificar existencia
                                </button>

                                <button
                                    className="flex items-center bg-[#4eb996] border[2px] border-[white] text-[#ffffff] py-[10px] px-[20px] rounded-[6px] font-[500] hover:bg-[#21b082] transition-colors duration-[200ms] shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[18px] h-[18px] mr-[8px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Agregar nuevo nombre cientifico
                                </button>
                            </div>
                        </div>

                        <p className="text-[14px] text-[#6b7280] mt-[16px] bg-[#f3f4f6] p-[12px] rounded-[6px]">
                            <span className="font-[600]">Nota:</span> Antes de agregar un nuevo nombre cientifico, verifica que no exista en el sistema para evitar duplicados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
