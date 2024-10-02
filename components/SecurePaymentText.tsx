import { FaCcMastercard, FaCcVisa, FaCcDiscover, FaCcAmex } from 'react-icons/fa';
export default function PaySecureText() {
    return (
        <div className="flex flex-col sm:flex-row items-center">
            <span className="sm:mr-4 text-sm">Paga seguro con</span>
            <div className="flex space-x-2">
                <FaCcMastercard className="text-2xl" />
                <FaCcVisa className="text-2xl" />
                <FaCcDiscover className="text-2xl" />
                <FaCcAmex className="text-2xl" />
            </div>
        </div>
    )
}
