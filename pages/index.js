import React from "react";
import Head from 'next/head';
import toast, {Toaster} from 'react-hot-toast';
import Link from "next/link";


const ListBox = ({items}) => (
	<ol className={"list-decimal list-inside"}>
		{
			items.length > 0
				? items.map((item, index) => <li key={index}>{item}</li>)
				: <span className={"text-xs"}>No data to display</span>
		}
	</ol>
)

export default function Home() {

	const [data, setData] = React.useState("")
	const [loading, setLoading] = React.useState(false)

	const [objective, setObjective] = React.useState("")
	const [skills, setSkills] = React.useState([])
	const [pointers, setPointers] = React.useState([])
	const [error, setError] = React.useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			let response = await fetch("/api/generate", {
				method: 'POST',
				body: JSON.stringify({description: data}),
				headers: {
					"Content-type": "application/json"
				}
			})

			if (response.ok) {
				response = await response.json()
				setObjective(response.result.objective)
				setSkills(response.result.skills)
				setPointers(response.result.pointers)
				toast.success("Suggestions Generated")
			} else {
				response = await response.json()
				toast.error(response.error.message)
			}
		} catch (error) {
			console.error(error.message)
			toast.error(error.message)
		}
		setLoading(false)
	}

	return (
		<>
			<Head>
				<title>Resume Sidekick</title>
				<meta name="description" content="Generate resume suggestion from a job post or job title"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<link rel="icon" href="/favicon.ico"/>
			</Head>
			<main className={"bg-zinc-100"}>
				<div className={"border-b-2 text-4xl text-center py-5 bg-zinc-700 text-zinc-50"}>
					Resume Sidekick
				</div>
				<div className={"max-w-5xl mx-auto h-[calc(100vh-146px)] overflow-y-scroll"}>
					<div className={"md:grid md:grid-cols-2 gap-4"}>
						<div className={"p-5"}>
							<form onSubmit={handleSubmit}>
								<label htmlFor={"job-desc"} className={"text-lg font-bold text-zinc-500"}>
									Paste Job Description Below:
								</label>
								<textarea
									rows={10}
									onChange={(e) => setData(e.target.value)}
									value={data}
									id={"job-desc"}
									placeholder={"paste here..."}
									className={"w-full p-5 mt-3 border-2 border-purple-500 rounded-md resize-none outline-0"}
								/>
								<div className={"text-right mt-2"}>
									<button
										className={"inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md text-white bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 transition ease-in-out duration-150 disabled:cursor-not-allowed"}
										type={"submit"}
										disabled={loading}
									>
										{loading ? "Generating..." : "Generate"}
									</button>
								</div>
							</form>
						</div>
						<div className={"p-5 h-full max-h-[calc(100vh-146px)] overflow-y-scroll"}>
							<div>
								<h4>Career Objective</h4>
								<p>{objective ? objective : <span className={"text-xs"}>No data to display</span>}</p>
							</div>
							<div className={"mt-5"}>
								<h4>Skills</h4>
								<ListBox items={skills}/>
							</div>
							<div className={"mt-5"}>
								<h4>Pointers</h4>
								<ListBox items={pointers}/>
							</div>
						</div>
					</div>
				</div>
				<div className={"flex justify-between max-w-5xl mx-auto items-center py-4 border-t-2 px-5"}>
					<div className={"text-sm uppercase text-purple-500"}>all rights reserved 2023 &#169;</div>
					<Link href={"https://github.com/mejaz/Resume-Sidekick"} target={"_blank"}>
						<img src={"/github-mark.svg"} alt={"github-repo"} className={"w-7 h-7"}/>
					</Link>
				</div>
			</main>
			<Toaster/>
		</>
	)
}
