const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const opencage = require("opencage-api-client");

const PORT = process.env.PORT || 3000;

const app = express();
app.get("/", async (req, res) => {
	let qu = req.query.name.trim().split(",");

	await opencage
		.geocode({ q: qu })
		.then(data => {
			let lat = Number(data.results[0].geometry.lat);
			let lng = Number(data.results[0].geometry.lng);
			lat = -lat;
			if (lng > 0) {
				lng = lng - 180;
			} else {
				lng += 180;
			}
			opencage.geocode({ q: lat+','+lng }).then(
				d => {
						res.json({
								latitude: lat,
								longitude: lng,
								components: d.results[0].components,
								road: d.results[0].annotations.roadinfo
						})
				}
			);
		})
		.catch(error => {
			console.log("error", error.message);
		});
});

app.listen(PORT);
