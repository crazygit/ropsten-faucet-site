import Link from "next/link"
import { MdOutlineArrowBackIosNew } from "react-icons/md"

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <h1 className="text-2xl">{message}</h1>
      <p className="mt-8 hover:underline">
        <MdOutlineArrowBackIosNew className="inline" />
        <Link href="/">Back Home</Link>
      </p>
    </div>
  )
}
