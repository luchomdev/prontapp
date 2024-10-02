import { ReactNode } from "react"

interface ContainerProps {
    children: ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
    return (<div className="p-4 sm:p-8">
        {children}
    </div>)
}

export default Container;