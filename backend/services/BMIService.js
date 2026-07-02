class BMIService {
  static calculate(weight, height) {
    if (!height || !weight || height <= 0 || weight <= 0) return 22.0;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  static getCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }
}

module.exports = BMIService;
