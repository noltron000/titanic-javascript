// Get root tags
const body = document.querySelector('body')
const html = document.querySelector('html')
const container = document.querySelector('#container')

// Define new class for passengers.
// The inputs are pretty ugly so this will fix it up.
class Passenger {
	// A row of data in JSON represents a passenger.
	// A passanger is just a person with several qualities,
	// including their ticket purchase and personal info.
	constructor(entry) {
		// Cleaned metadata goes here.
		this.dataID = entry['datasetid']
		this.ticketID = entry['fields']['ticket']
		this.passengerID = entry['fields']['passengerid']
		this.recordID = entry['recordid']
		this.recordTime = entry['record_timestamp']

		// Passenger - personal information.
		this.name = entry['fields']['name']
		this.age = entry['fields']['age']
		this.sex = entry['fields']['sex']
		// This field includes both siblings & spouses.
		this.numSiblings = entry['fields']['sibsp']
		// This field includes both children & parents.
		this.numChildren = entry['fields']['parch']
		// This field is a string where it should be boolean.
		this.survived = this._cleanSurvived(entry)

		// Passenger - ticket information.
		this.fare = entry['fields']['fare']
		this.class = entry['fields']['pclass']
		this.cabin = entry['fields']['cabin']
		this.embarked = entry['fields']['embarked']
	}

	_cleanSurvived = (entry) => {
		// This internal function cleans the "survived" field.
		switch (entry['fields']['survived']) {
			case 'Yes':
				return true
			case 'No':
				return false
			default:
				return null
		}
	}
}

class Titanic {
	constructor(data) {
		this.data = data
	}

	filterData = (field, data = undefined) => {
		// Default to use the entire dataset.
		// This can be switched to use another set,
		// for example the result of another filter.
		if (data === undefined) {
			data = this.data
		}

		// This "filter" object is a dictionary of key/list.
		// A key/list is a self-contained set of filtered data.
		let filter = {}

		// Loop through each item and classify them.
		data.forEach((entry) => {
			if (!filter.hasOwnProperty(entry[field])) {
				// Create a key/list if it does not exist in filter.
				filter[entry[field]] = []
			}
			// Push entry to associated key/list.
			filter[entry[field]].push(entry)
		})

		return filter
	}
}

const fetchData = (parse) => {
	// Fetch data.
	fetch('./titanic-passengers.json')
	.then((response) => {
		// Jsonify fetched file.
		return response.json()
	})
	.then((json) => {
		// Clean json with the Passenger Class.
		let data = []
		json.forEach((entry) => {
			data.push(new Passenger(entry))
		})
		// Use the data in the Titanic Class.
		return new Titanic(data)
	})
	.then((TitanicData) => {
		// Digest the data with a parse parameter function.
		parse(TitanicData)
	})
	.catch((error) => {
		// Explain error to browser.
		console.error(error.message)
		throw new Error('Problem handling JSON file!')
	})
}

const logSolutions = (T) => {
	console.log(
		'PROBLEM #1:\n' +
		'Retrieve the first passanger\'s data.\n'
	)
	console.info(
		T.data[0]
	)


	console.log(
		'PROBLEM #2:\n' +
		'Retrieve the length of the dataset.\n'
	)
	console.info(
		T.data.length
	)


	console.log(
		'PROBLEM #3:\n' +
		'How many survived on the titanic?\n'
	)
	console.info(
		T.filterData('survived')[true].length
	)


	console.log(
		'PROBLEM #4:\n' +
		'How many passenger classes exist?\n'
	)
	console.info(
		Object.keys(T.filterData('class')).length
	)


	{ // Block Scoped to remove unneeded variables after.
		console.log(
			'PROBLEM #5:\n' +
			'How many passengers are in each class?\n'
		)
		// Create a filtered dictionary of key/data pairs.
		let passByClass = T.filterData('class')
		for (const key in passByClass) {
			// Replace data-lists with their length.
			passByClass[key] = passByClass[key].length
		}
		console.info(
			passByClass
		)
	}


	{ // Block Scoped to remove unneeded variables after.
		console.log(
			'PROBLEM #6:\n' +
			'How many passengers died in each class?\n'
		)
		// Create a filtered dictionary of key/data pairs.
		// We want to first filter by class.
		let passByClass = T.filterData('class')
		for (const key in passByClass) {
			const data = passByClass[key]
			// Further filter each class-data with survival rates.
			const passBySurvival = T.filterData('survived', data)
			// We only want those who died; use the "false" key.
			const fatalities = passBySurvival[false]
			// Replace data-lists with the number of fatalities.
			passByClass[key] = fatalities.length
		}
		console.info(
			passByClass
		)
	}


	{ // Block Scoped to remove unneeded variables after.
		console.log(
			'PROBLEM #7:\n' +
			'What are all of the ages in the dataset?\n'
		)
		// Create a filtered dictionary of key/data pairs.
		let passByAge = T.filterData('age')
		for (const key in passByAge) {
			const data = passByAge[key]
			// Replace data-lists with the count of each age.
			passByAge[key] = data.length
		}
		console.info(
			passByAge
		)
	}


	console.log(
		'PROBLEM #8:\n' +
		'How many passengers embarked from Queenstown?\n'
	)
	console.info(
		Object.keys(T.filterData('embarked')['Q']).length
	)


	{ // Block Scoped to remove unneeded variables after.
		console.log(
			'PROBLEM #9:\n' +
			'How many passengers traveled with a nanny?\n'
		)
		// Create a filtered dictionary of key/data pairs.
		let passByNanny = T.filterData('numChildren')[0]
		let validChild = []
		for (const child of passByNanny) {
			if (child['age'] < 18 && child['age'] > 0) {
				validChild.push(child)
			}
		}
		console.info(
			validChild.length
		)
	}


	{ // Block Scoped to remove unneeded variables after.
		console.log(
			'PROBLEM #10:\n' +
			'What are the youngest and oldest passengers\' age?\n'
		)
		// Create a filtered dictionary of key/data pairs.
		let passByAge = T.filterData('age')
		let min = Infinity
		let max = -Infinity
		for (let key in passByAge) {
			const data = passByAge[key]
			// Replace data-lists with the count of each age.
			passByAge[key] = data.length
			// Checks min & max too
			key = parseFloat(key)
			if (key === NaN || key == null || key == undefined) {
				let doNothing
			} else if (min > key) {
				min = key
			} else if (max < key) {
				max = key
			}
		}
		console.info(
			min, max
		)
	}


	{ // Block Scoped to remove unneeded variables after.
		console.log(
			'PROBLEM #11:\n' +
			'What are the min and max fares in the dataset?\n'
		)
		// Create a filtered dictionary of key/data pairs.
		let passByFare = T.filterData('fare')
		let min = Infinity
		let max = -Infinity
		for (let key in passByFare) {
			let data = passByFare[key]
			// Replace data-lists with their length.
			passByFare[key] = passByFare[key].length
			// Checks min & max too
			key = parseFloat(key)
			if (key === undefined) {
				let doNothing
			} else if (min > key) {
				min = key
			} else if (max < key) {
				max = key
			}
		}
		console.info(
			min, max
		)
	}


	{ // Block Scoped to remove unneeded variables after.
		console.log(
			'PROBLEM #12:\n' +
			'How many siblings are there?\n'
		)
		let counter = 0
		const passBySiblings = T.filterData('numSiblings')
		for (key in passBySiblings) {
			if (key != '0') {
				counter += passBySiblings[key].length
			}
		}
		console.info(
			counter
		)
	}


	{ // Block Scoped to remove unneeded variables after.
		console.log(
			'PROBLEM #13:\n' +
			'Get survival rates of siblings vs only-children.\n'
		)
		const passBySiblings = T.filterData('numSiblings')
		for (const key in passBySiblings) {
			const data = passBySiblings[key]
			// Further filter each class-data with survival rates.
			const passBySurvival = T.filterData('survived', data)
			// We only want the survival rate.
			// The rate of survival is true / total
			let survivors = passBySurvival[true]
			if (survivors !== undefined) {
				survivors = survivors.length
			} else {
				survivors = 0
			}
			const total = passBySiblings[key].length
			const rate = survivors / total
			// Replace data-lists with the rate of fatality.
			passBySiblings[key] = rate
		}
		console.info(
			passBySiblings
		)
	}
	
	console.log(
		'PROBLEM #14:\n' +
		'Count how many unique ages exist in the dataset.\n'
	)
	console.info(
		Object.keys(T.filterData('age')).length
	)
}

fetchData(logSolutions)

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
function handleData(data) {
	const betterData = data.map(({fields}) => {
		const el = document.createElement('div')
		fields.el = el
		fields.showFare = () => {
			el.style.height = fields.fare * 100
		}
		fields.showAge = () => {
			el.style.height = fields.age * 100
		}
		return fields
	})

	// Click fare button
	betterData.forEach((pessenger) => pessenger.showFare())

	console.log(data)
	const maxAge = data.reduce((acc, passenger) => {
		const age = passenger.fields.age !== undefined ? passenger.fields.age : 0
		return Math.max(acc, age)
	}, 0)
	console.log(maxAge)

	for (let item of data) {
		const {fields} = item
		const {fare, name, age, embarked, parch, pclass, sex, sibsp, survived} = fields

		const size = fare * 1
		const bgColor = survived === 'Yes' ? 'rgba(51, 208, 45, 0.125)' : 'rgba(195, 52, 52, 0.125)'
		const agePercent = age / maxAge

		const el = document.createElement('div')
		el.style.borderRadius = sex === 'female' ? '50% 50% 50% 0' : '50% 0 50% 50%'
		el.style.width = `${size}px` // Normalize and use %
		el.style.height = `${size}px`
		el.style.margin = '1px'
		el.style.position = 'absolute'
		el.style.border = '1px solid rgba(0, 0, 0, 0.61)'
		el.style.transform = 'translate(-50%, -50%)'
		el.style.left = `${100 * agePercent}%`
		el.style.top = '50%'
		el.style.backgroundColor = bgColor
		// el.style.backgroundColor = '#000'
		container.prepend(el)
	}
}

// Challenges
// - Add the date to the left of each bar
// - Make the bars draw vertically
// - Add the date below each bar
// - Change the color of each bar
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
