import {Configuration, OpenAIApi} from 'openai'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export default async function (req, res) {

	const {description} = req.body

	if (!configuration.apiKey) {
		return res.status(500).json({
			error: {
				message: "api key missing!"
			}
		})
	}

	if (description.trim().length === 0) {
		return res.status(400).json({
			error: {
				message: "job description cannot be empty"
			}
		})
	}

	try {
		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			temperature: 0.7,
			max_tokens: 2000,
			prompt: getPrompt(description)
		})

		let data = JSON.parse(completion.data.choices[0].text)
		return res.json({result: data})

	} catch (error) {
		console.log(error)
		return res.status(400).json({
			error: {
				message: error.message
			}
		})
	}
}

const getPrompt = (description) => {
	return `For the below job description, suggest a career objective, list of skills and list of suitable tasks
	in a json format. You have to return only a JSON. Below is the expected JSON format:
	{
		"objective": "",
	  "skills": [],
	  "pointers": []		
	}
	
	Job Description:
	${description}
	`
}