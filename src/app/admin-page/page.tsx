import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="p-[32px] h-[100vh] flex flex-col bg-gradient-to-b from-[#f0f9ff] to-[#e9f8d9]">
            <h1 className="text-center text-[36px] font-[700] mb-[32px] text-[#333] border-b-[2px] pb-[16px] border-[#eaeaea]">
                Panel Administrativo
            </h1>

            <div
                className="grid grid-cols-3 gap-[24px] flex-grow">
                <div
                    className="bg-[#f8f9fa] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border-[1px] border-[#e9ecef] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-shadow duration-[300ms] flex flex-col">
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">Añadir Subespecie</h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            Para añadir una nueva subespecie, ya sea para modificar un alimento existente o para
                            agregarla a un nuevo alimento.
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link href="/admin-page/add-subspecies"
                                  className="w-full text-center py-[12px] px-[24px] bg-[#3498db] text-[#ffffff] rounded-[6px] font-[600] hover:bg-[#2980b9] transition-colors duration-[200ms] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                Añadir Subespecie
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-[#f8f9fa] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border-[1px] border-[#e9ecef] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-shadow duration-[300ms] flex flex-col">
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">Añadir alimento</h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            Para agregar un solo alimento y todos los datos que lo componen.
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link href="/admin-page/add-food"
                                  className="w-full text-center py-[12px] px-[24px] bg-[#2ecc71] text-[#ffffff] rounded-[6px] font-[600] hover:bg-[#27ae60] transition-colors duration-[200ms] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                Añadir Comida
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-[#f8f9fa] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border-[1px] border-[#e9ecef] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-shadow duration-[300ms] flex flex-col">
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">Añadir por Archivo Excel</h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            Para añadir alimentos y referencias nuevos o actualizar existentes desde el archivo excel
                            convencional.
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link href="/admin-page/add-foods-and-references"
                                  className="w-full text-center py-[12px] px-[24px] bg-[#9b59b6] text-[#ffffff] rounded-[6px] font-[600] hover:bg-[#8e44ad] transition-colors duration-[200ms] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                Añadir por XLSX
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-[#f8f9fa] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border-[1px] border-[#e9ecef] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-shadow duration-[300ms] flex flex-col">
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">Añadir Referencia</h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            Para añadir una nueva referencia que no existe actualmente.
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link href="/admin-page/add-reference"
                                  className="w-full text-center py-[12px] px-[24px] bg-[#e74c3c] text-[#ffffff] rounded-[6px] font-[600] hover:bg-[#c0392b] transition-colors duration-[200ms] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                Añadir Referencia
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-[#f8f9fa] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border-[1px] border-[#e9ecef] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-shadow duration-[300ms] flex flex-col">
                    <div className="p-[20px] flex-grow flex flex-col">
                        <h3 className="text-[20px] font-[600] mb-[12px] text-[#2c3e50]">Añadir Nombre Científico</h3>
                        <p className="text-[16px] text-[#495057] leading-[1.6] flex-grow">
                            Para añadir un nuevo nombre científico que no existe actualmente.
                        </p>
                        <div className="mt-[16px] flex justify-center">
                            <Link href="/admin-page/add-scientific-name"
                                  className="w-full text-center py-[12px] px-[24px] bg-[#f39c12] text-[#ffffff] rounded-[6px] font-[600] hover:bg-[#d35400] transition-colors duration-[200ms] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                Añadir Nombre Científico
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
