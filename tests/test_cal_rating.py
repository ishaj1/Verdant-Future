"""Tests helper function for evaluation""" 
def calculate_rating(company_input, benchmark, negative=False):
    initial = 50
    performance = company_input - benchmark
    if(negative):
        performance *= -1
    performance_ratio = performance / benchmark
    rating = initial + 50 * performance_ratio
    return rating

def test_calculate_rating_greater_than_benchmark():
    # Test when company_input is greater than benchmark
    company_input = 60
    benchmark = 50
    rating = calculate_rating(company_input, benchmark)
    assert rating == 60

def test_calculate_rating_less_than_benchmark():
    # Test when company_input is less than benchmark
    company_input = 40
    benchmark = 50
    rating = calculate_rating(company_input, benchmark)
    assert rating == 40

def test_calculate_rating_equal_to_benchmark():
    # Test when company_input is equal to benchmark
    company_input = 50
    benchmark = 50
    rating = calculate_rating(company_input, benchmark)
    assert rating == 50

def test_calculate_rating_negative():
    # Test when company_input is less than benchmark and negative is True
    company_input = 40
    benchmark = 50
    rating = calculate_rating(company_input, benchmark, negative=True)
    assert rating == 60

def test_calculate_rating_positive():
    # Test when company_input is greater than benchmark and negative is True
    company_input = 60
    benchmark = 50
    rating = calculate_rating(company_input, benchmark, negative=True)
    assert rating == 40