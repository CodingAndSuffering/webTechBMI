namespace WebTechBMI.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public double Height { get; set; }
        public double Weight { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string ActivityLevel { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;

        /// <summary>
        /// Calculates BMI based on weight (kg) and height (cm)
        /// </summary>
        public double CalculateBMI()
        {
            if (Height <= 0 || Weight <= 0)
                return 0;
            
            return Math.Round(Weight / Math.Pow(Height / 100.0, 2), 1);
        }

        /// <summary>
        /// Returns the BMI status category
        /// </summary>
        public string GetBMIStatus()
        {
            double bmi = CalculateBMI();
            
            if (bmi < 18.5)
                return "Underweight";
            if (bmi < 25)
                return "Normal";
            if (bmi < 30)
                return "Overweight";
            return "Obese";
        }

        /// <summary>
        /// Calculates daily calorie requirements based on BMR and activity level
        /// </summary>
        public CaloriePlan? CalculateCaloriePlan()
        {
            if (string.IsNullOrEmpty(Gender) || string.IsNullOrEmpty(ActivityLevel))
                return null;

            // Calculate Basal Metabolic Rate (BMR)
            double bmr = Gender.ToLower() == "male"
                ? 10 * Weight + 6.25 * Height - 5 * Age + 5
                : 10 * Weight + 6.25 * Height - 5 * Age - 161;

            // Activity multiplier
            double activityMultiplier = ActivityLevel.ToLower() switch
            {
                "low" => 1.2,
                "moderate" => 1.55,
                "high" => 1.9,
                _ => 1.2
            };

            int maintenance = (int)Math.Round(bmr * activityMultiplier);

            return new CaloriePlan
            {
                Maintain = maintenance,
                Lose = maintenance - 500,
                Gain = maintenance + 500
            };
        }
    }

    public class CaloriePlan
    {
        public int Maintain { get; set; }
        public int Lose { get; set; }
        public int Gain { get; set; }
    }
}
