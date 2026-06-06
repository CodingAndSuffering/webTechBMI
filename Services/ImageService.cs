namespace WebTechBMI.Services
{
    public class ImageService
    {
        /// <summary>
        /// Selects an image URL based on user's BMI
        /// </summary>
        public string GetImageByBMI(double weight, double height)
        {
            double bmi = weight / Math.Pow(height / 100.0, 2);

            if (bmi < 18.5)
                return "https://static.wikia.nocookie.net/allthetropes/images/2/26/Yzma.jpg/revision/latest/scale-to-width-down/285?cb=20240929011323";

            if (bmi < 25)
                return "https://media.printler.com/media/photo/184635.jpg";

            if (bmi < 30)
                return "https://static.boredpanda.com/blog/wp-content/uploads/2024/11/Fat-cartoon-character-4-6736f2b7a5105__700.jpg";

            return "https://static.wikia.nocookie.net/characters/images/8/8c/Diabeto.png/revision/latest/thumbnail/width/360/height/450?cb=20250916231158";
        }
    }
}
