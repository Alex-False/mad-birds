const fetchBirds = async (req, res) => {
  const options = {
    headers: { "X-Api-Key": process.env.API_KEY },
    contentType: "application/json",
  };

  try {
    const response = await fetch(
      "https://api.api-ninjas.com/v1/animals?name=bird",
      options
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bird data" });
  }
};

export default fetchBirds;
