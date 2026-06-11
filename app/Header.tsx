export default function Header(){
    return(
    <header className="flex justify-between items-center bg-dark-blue h-17">
        <h1 className="text-2xl text-grey font-color ml-3">FormulaDash</h1>
        <div className="flex gap-10 mr-3">
            <p className="border-b-2 border-transparent hover:border-white">Dashboard</p>
        </div>
    </header>
    )
}