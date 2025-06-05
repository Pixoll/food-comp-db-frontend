import api from "@/api";
import ClientDetailPage from "./client";

export async function generateStaticParams() {
    try {
        const result = await api.getFoodsV1();
        if (result.error) {
            console.error("Error generating static params:", result.error);
            return [];
        }

        return result.data.map(food => ({ code: food.code }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function DetailFoodPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    return <ClientDetailPage code={code}/>;
}
