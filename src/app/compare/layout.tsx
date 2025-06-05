import {ReactNode} from "react"
import Footer from "@/app/components/Footer";

type ComparePageProps = {
    children: ReactNode;
}
export default function ComparePageLayout ({children}:ComparePageProps){
    return(
        <div>
            {children}
            <Footer></Footer>
        </div>
    )
}
