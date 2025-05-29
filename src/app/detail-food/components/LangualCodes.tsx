import {LangualCode} from "@/types/SingleFoodResult";
type LangualCodesProps = {
    data: LangualCode[]
}

export default function LangualCodes({data}: LangualCodesProps) {
    return (
        <table className="w-[100%] border-collapse shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-[8px] overflow-hidden">
            <thead className="bg-[#f8f9fa]">
            <tr className="border-[2px] border-[#000000]">
                <th className="py-[12px] px-[16px] text-[14px] font-[600] text-left border-b-[2px] border-[#e2e8f0]">
                    Código
                </th>
                <th className="py-[12px] px-[16px] text-[14px] font-[600] text-left border-b-[2px] border-[#e2e8f0]">
                    Descripción
                </th>
                <th className="py-[12px] px-[16px] text-[14px] font-[600] text-left border-b-[2px] border-[#e2e8f0]">
                    Clasificación
                </th>
            </tr>
            </thead>
            <tbody>
            {data && data.length > 0 && (
                data.flatMap(lcode => {
                    const mainRow = (
                        <tr
                            className="border-b-[1px] border-[#e2e8f0] hover:bg-[#f1f5f9]"
                            key={`main-${lcode.id}`}
                        >
                            <td className="py-[12px] px-[16px] text-[14px] text-[#334155]">{lcode.code}</td>
                            <td className="py-[12px] px-[16px] text-[14px] text-[#334155] font-[500]">{lcode.descriptor}</td>
                            <td className="py-[12px] px-[16px] text-[14px] text-[#334155]">
                                {lcode.children.length > 0 ? lcode.children[0].code + ', ' + lcode.children[0].descriptor : ""}
                            </td>
                        </tr>
                    );
                    const childRows = lcode.children.length > 1
                        ? lcode.children.slice(1).map((lchild, index) => (
                            <tr
                                className="border-b-[1px] border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#f1f5f9]"
                                key={`child-${lcode.id}-${index}`}
                            >
                                <td className="py-[8px] px-[16px] text-[13px] text-[#64748b]">{""}</td>
                                <td className="py-[8px] px-[16px] text-[13px] text-[#64748b]">{""}</td>
                                <td className="py-[8px] px-[16px] text-[13px] text-[#64748b] pl-[32px]">
                                        <span className="inline-block">
                                            <span className="font-[500]">{lchild.code}</span>, {lchild.descriptor}
                                        </span>
                                </td>
                            </tr>
                        ))
                        : [];
                    return [mainRow, ...childRows];
                })
            )}
            </tbody>
        </table>
    );
}
