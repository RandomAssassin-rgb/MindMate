async function test() {
  const payload = {
    situation: "API Integration Test",
    automaticThought: "Testing if the environment variable is loaded.",
    emotion: "Curiosity",
    intensity: 100,
    balancedThought: "The script will tell me the truth."
  };

  try {
    const response = await fetch('http://localhost:3888/api/cbt-reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    require('fs').writeFileSync('api_result.json', JSON.stringify(data.debug || data, null, 2));
    console.log('Wrote output to api_result.json');
    
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

test();
