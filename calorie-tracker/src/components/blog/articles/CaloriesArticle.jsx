import BlogLayout from '../BlogLayout';
import { Link } from 'react-router-dom';

export default function CaloriesArticle() {
  return (
    <BlogLayout>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link to="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400">Blog</Link>
        {' > '}
        <span>Guides</span>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
        <img
          src="/images/blog/calories-guide.webp"
          alt="What are calories guide"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Header */}
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          What Are Calories? A Complete Guide to Calorie Tracking
        </h1>

        {/* TL;DR */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-6 my-8 rounded-r-lg">
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mt-0 mb-3">
            💡 TL;DR
          </h3>
          <ul className="mb-0 list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-200">
            <li>A calorie is a unit of energy your body uses to function</li>
            <li>Eat more calories than you burn → gain weight. Eat less → lose weight.</li>
            <li>Calorie tracking works because it creates awareness and accountability</li>
            <li>You don't need to track forever, but it teaches you portion sizes and food choices</li>
          </ul>
        </div>

        {/* Article Content */}
        <h2 className="text-2xl font-bold mt-8 mb-4">What Is a Calorie?</h2>

        <p>
          A <strong>calorie</strong> is a unit of measurement for energy. Specifically, one calorie is the amount of energy needed to raise the temperature of 1 gram of water by 1 degree Celsius.
        </p>

        <p>
          When we talk about food calories, we're actually talking about <strong>kilocalories</strong> (1,000 calories = 1 kilocalorie). So when a food label says "200 calories," it technically means 200 kilocalories, or 200,000 actual calories. But for simplicity, everyone just says "calories."
        </p>

        <p>
          Your body uses calories (energy) for everything:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Keeping you alive:</strong> Breathing, heart beating, brain functioning, cell repair</li>
          <li><strong>Digesting food:</strong> Breaking down and processing nutrients</li>
          <li><strong>Moving around:</strong> Walking, standing, fidgeting, exercising</li>
          <li><strong>Growing and recovering:</strong> Building muscle, healing injuries, fighting illness</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Where Do Calories Come From?</h2>

        <p>
          Calories come from three macronutrients in food:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li><strong>Protein:</strong> 4 calories per gram (chicken, fish, eggs, tofu)</li>
          <li><strong>Carbohydrates:</strong> 4 calories per gram (bread, rice, fruit, vegetables)</li>
          <li><strong>Fat:</strong> 9 calories per gram (oils, butter, nuts, avocado)</li>
        </ul>

        <p>
          Alcohol also provides 7 calories per gram, but it's not a macronutrient because your body doesn't use it for nutrition. Learn more about <Link to="/blog/what-are-macros" className="text-emerald-600 dark:text-emerald-400 hover:underline">what macronutrients are and what they do</Link>.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">How Does Weight Loss Actually Work?</h2>

        <p>
          Weight management comes down to <strong>energy balance</strong>:
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="text-red-700 dark:text-red-400 font-bold mt-0 mb-2">Calorie Deficit</h4>
            <p className="text-sm mb-0">Eat fewer calories than you burn → <strong>Lose weight</strong></p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="text-green-700 dark:text-green-400 font-bold mt-0 mb-2">Maintenance</h4>
            <p className="text-sm mb-0">Eat the same calories you burn → <strong>Maintain weight</strong></p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-blue-700 dark:text-blue-400 font-bold mt-0 mb-2">Calorie Surplus</h4>
            <p className="text-sm mb-0">Eat more calories than you burn → <strong>Gain weight</strong></p>
          </div>
        </div>

        <p>
          This isn't opinion—it's physics. Your body can't create energy out of nothing. For most healthy individuals, consistently eating in a calorie deficit typically leads to weight loss over time. However, individual results vary based on metabolism, hormones, medical conditions, and medications. If you have concerns or aren't seeing expected results, consult a healthcare provider. The challenge isn't the science; it's the consistency.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">What About Maintenance and Gaining Muscle?</h3>

        <p>
          <strong>Maintenance:</strong> If your goal is to maintain your current weight, eat at your <Link to="/blog/how-to-calculate-tdee" className="text-emerald-600 dark:text-emerald-400 hover:underline">TDEE (Total Daily Energy Expenditure)</Link>. This is your maintenance calories—the amount your body burns each day. Track for a few weeks to dial it in, then you can stop tracking if you want. Weighing yourself weekly helps confirm you're staying stable.
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6 text-sm text-gray-700 dark:text-gray-300">
          <strong>Important:</strong> These are general guidelines for healthy adults. Consult a healthcare provider or registered dietitian before starting a muscle-building program, especially if you have kidney disease, metabolic conditions, or other health concerns.
        </div>

        <p>
          <strong>Gaining Lean Muscle:</strong> To build muscle, you need to eat in a slight calorie surplus (200-500 above TDEE) combined with strength training. But here's the key: eat too much and you'll gain mostly fat. A common approach is a small surplus with high <Link to="/blog/what-are-macros" className="text-emerald-600 dark:text-emerald-400 hover:underline">protein intake</Link> (1-1.2g per pound of body weight), aiming to gain 0.5-1 lb per week. Faster weight gain may indicate you're gaining more fat alongside muscle.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">What Is Calorie Tracking?</h2>

        <p>
          Calorie tracking is the practice of logging the food you eat and monitoring how many calories you consume each day. Most people use an app to:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>Search for foods or scan barcodes</li>
          <li>Log portions and serving sizes</li>
          <li>See their total calories for the day</li>
          <li>Compare their intake to their calorie goal</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Why Does Calorie Tracking Work?</h2>

        <p>
          Calorie tracking works for three main reasons:
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">1. It Creates Awareness</h3>
        <p>
          Most people have no idea how many calories they eat. <a href="https://pubmed.ncbi.nlm.nih.gov/1454084/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">Studies show people underestimate their intake by 30-50%</a>. When you track, you see the truth. That "small" muffin? 500 calories. That "healthy" salad with dressing, cheese, and croutons? 800 calories.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">2. It Creates Accountability</h3>
        <p>
          When you know you'll have to log it, you think twice. Do you really want that third slice of pizza? Logging makes you pause and make conscious choices instead of mindlessly eating.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">3. It Removes Guesswork</h3>
        <p>
          "Am I eating too much? Too little? Why isn't the scale moving?" Calorie tracking gives you data. If you're not losing weight, the numbers tell you exactly why. No more mystery. Adjust your intake and track the results.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Common Myths About Calorie Tracking</h2>

        <h3 className="text-xl font-bold mt-6 mb-3">Myth 1: "All calories are equal"</h3>
        <p>
          For weight loss, yes—200 calories of broccoli and 200 calories of cookies both affect your weight the same way. But for health, nutrition, hunger, and muscle preservation? Not at all. <Link to="/blog/what-are-macros" className="text-emerald-600 dark:text-emerald-400 hover:underline">Macronutrients matter</Link>. Protein keeps you full and preserves muscle. Fiber-rich carbs provide sustained energy. Healthy fats support hormones. So track calories <em>and</em> pay attention to food quality.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">Myth 2: "Calorie tracking is too much work"</h3>
        <p>
          It takes about 5-10 minutes per day once you get the hang of it. Barcode scanning makes it even faster—scan, log, done. Many people track for a few months to learn portion sizes, then stop. Others track long-term because it keeps them accountable and helps them maintain their results. Both approaches work. The key is finding what fits your lifestyle. Think of it like checking your bank account—it's just information that helps you make better decisions.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">How to Start Tracking Calories</h2>

        <p>
          Here's how to get started:
        </p>

        <ol className="list-decimal ml-6 space-y-2 my-6">
          <li><strong>Calculate your TDEE:</strong> Use our <Link to="/blog/how-to-calculate-tdee" className="text-emerald-600 dark:text-emerald-400 hover:underline">TDEE calculator</Link> to find your maintenance calories</li>
          <li><strong>Set your calorie goal:</strong> Eat 200-500 below TDEE for fat loss, or at TDEE to maintain</li>
          <li><strong>Choose a tracking app:</strong> Free Calorie Track, MyFitnessPal, Cronometer, etc.</li>
          <li><strong>Log everything for 2 weeks:</strong> Get brutally honest about your intake</li>
          <li><strong>Adjust as needed:</strong> If you're not seeing results after 2-3 weeks, lower your calorie target by 100-200</li>
        </ol>

        <h2 className="text-2xl font-bold mt-8 mb-4">Track Your Calories with Free Calorie Track</h2>

        <p>
          Free Calorie Track makes calorie tracking simple:
        </p>

        <ul className="list-disc ml-6 space-y-2 my-6">
          <li>✅ Barcode scanning for instant food logging</li>
          <li>✅ Searchable database of thousands of foods</li>
          <li>✅ Custom recipes and quick-add foods</li>
          <li>✅ Net calorie tracking (food - exercise - TDEE)</li>
          <li>✅ Macro tracking (protein, carbs, fat)</li>
          <li>✅ Works 100% offline</li>
          <li>✅ Completely free forever—no premium paywall</li>
        </ul>

        <div className="text-center my-8">
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Start Tracking Free
          </Link>
        </div>

        {/* Related Posts */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 mt-12">
          <h3 className="text-xl font-bold mb-4">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/blog/what-are-macros"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">🍎</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                What Are Macros?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Learn about protein, carbs, and fat
              </p>
            </Link>
            <Link
              to="/blog/how-to-calculate-tdee"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                How to Calculate TDEE
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
                Find your maintenance calories
              </p>
            </Link>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
