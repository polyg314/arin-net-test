from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from flask_cors import CORS
from webdriver_manager.chrome import ChromeDriverManager

app = Flask(__name__)
CORS(app, resources={r"/search-arin": {"origins": "https://arin-net-test-fe-2l2i6lgdxq-wl.a.run.app"}}, supports_credentials=True)

@app.route('/search-arin', methods=['POST'])
def search_arin():
    """
        Function to scarpe arin.net endpoint net range for specific ip address, based on https://search.arin.net/rdap/?query={ip_address} endpoint

        Argumenets: ip_address as string. 

        Returns: net_range associated with ip_address
    """

    if not request.json or 'ip_address' not in request.json:
        return jsonify({'error': 'Please provide an IP address in the request body with the key "ip_address".'}), 400

    ip_address = request.json['ip_address']
    arin_url = f'https://search.arin.net/rdap/?query={ip_address}'

    # Set up the Selenium WebDriver
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run Chrome in headless mode
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(arin_url)
        # Adjust the wait time and condition according to dl elements with class="row secondary" inside div with id="resultsContainer"
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '#resultsContainer dl.row.secondary'))
        )
        # Find the "Net Range" <dt> and the corresponding <dd>
        net_range_dt = driver.find_elements(By.CSS_SELECTOR, 'dl.row.secondary dt')
        for dt in net_range_dt:
            # target element occurs after dt with text == 'Net Range'
            if dt.text == 'Net Range':
                dd = dt.find_element(By.XPATH, './following-sibling::dd')
                net_range = dd.text
                break

        driver.quit()
        if net_range:
            return jsonify({'net_range': net_range})
        else:
            return jsonify({'error': 'Net Range not found.'}), 404
    except TimeoutException:
        driver.quit()
        return jsonify({'error': 'Timeout waiting for page to load.'}), 1000

if __name__ == '__main__':
    app.run(debug=True)
