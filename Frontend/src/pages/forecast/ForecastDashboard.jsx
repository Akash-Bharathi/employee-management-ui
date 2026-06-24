import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { FaDownload } from "react-icons/fa";
import {
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";
import { PieChart, Pie, Cell, Legend, } from "recharts";
import MainLayout from "../../components/layout/MainLayout";
import {
    getDemandSummary,
    getCategories,
    getProducts,
    getCategoryForecast,
    getProductForecast,
    getForecastDetails,
    getForecastComparison,
} from "../../services/forecastService";
import "./forecast.css";

export default function ForecastDashboard() {
    const [summary, setSummary] = useState(null);

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const ROWS_PER_PAGE = 7;

    const [categoryForecast, setCategoryForecast] = useState([]);
    const [productForecast, setProductForecast] = useState([]);
    const [forecastDetails, setForecastDetails] = useState([]);
    const [filteredDetails, setFilteredDetails] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);
    const activeData =
        filteredDetails.length > 0
            ? filteredDetails
            : forecastDetails;

    const forecastTotal =
        Math.round(
            activeData.reduce(
                (sum, item) =>
                    sum + item.predicted_demand,
                0
            )
        );
    const handleExport = () => {

        const rows =
            filteredDetails.length > 0
                ? filteredDetails
                : forecastDetails;

        const csv = [

            [
                "Date",
                "Product",
                "Category",
                "Predicted Demand",
                "Confidence"
            ].join(","),

            ...rows.map(row =>
                [
                    row.date,
                    row.product_name,
                    row.category,
                    row.predicted_demand,
                    row.confidence
                ].join(",")
            )

        ].join("\n");

        const blob =
            new Blob(
                [csv],
                { type: "text/csv" }
            );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            "forecast-report.csv";

        a.click();

        URL.revokeObjectURL(url);
    };
    const avgConfidence =
        activeData.length
            ? Math.round(
                activeData.reduce(
                    (sum, item) =>
                        sum + item.confidence,
                    0
                ) / activeData.length
            )
            : 0;

    const productsTracked =
        new Set(
            activeData.map(
                item => item.product_name
            )
        ).size;

    const categoriesTracked =
        new Set(
            activeData.map(
                item => item.category
            )
        ).size;

    const chartWidth = Math.max(900, comparisonData.length * 32);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {

            const [
                summaryData,
                categoryData,
                productData,
                detailsData,
                comparisonData,
            ] = await Promise.all([
                getDemandSummary(),
                getCategories(),
                getProducts(),
                getForecastDetails(),
                getForecastComparison(),
            ]);
            setComparisonData(comparisonData);
            setSummary(summaryData);
            setFilteredCategories(summaryData.top_categories);
            setFilteredProducts(summaryData.top_products);

            setCategories(categoryData);

            setProducts(productData);

            setForecastDetails(detailsData);
            setFilteredDetails(detailsData);

            setSelectedCategory("ALL");
            setSelectedProduct("ALL");

        } catch (err) {
            console.error(err);
        }
    };
    const PIE_COLORS = [
        "#3b82f6",
        "#8b5cf6",
        "#06b6d4",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#ec4899",
        "#14b8a6",
        "#6366f1",
        "#f97316",
        "#84cc16",
        "#a855f7",
        "#0ea5e9",
        "#22c55e",
        "#eab308",
        "#f43f5e",
        "#8b5cf6",
        "#06b6d4",
        "#10b981",
        "#f97316",
    ];
    const handleCategoryChange = async (value) => {

        setSelectedCategory(value);
        const comparison =
            await getForecastComparison(
                value,
                selectedProduct || "ALL"
            );

        setComparisonData(comparison);

        if (value === "ALL") {

            setFilteredCategories(
                summary.top_categories
            );

            setFilteredDetails(
                forecastDetails.filter(item =>
                    selectedProduct === "ALL"
                        ? true
                        : item.product_name === selectedProduct
                )
            );

            return;
        }

        const data =
            await getCategoryForecast(value);

        setCategoryForecast(
            data.forecast
        );

        setFilteredCategories([
            {
                aisle: value,
                quantity:
                    data.forecast.reduce(
                        (sum, row) =>
                            sum + row.forecast_quantity,
                        0
                    )
            }
        ]);
        setFilteredDetails(
            forecastDetails.filter(item =>
                item.category === value &&
                (
                    selectedProduct === "ALL" ||
                    item.product_name === selectedProduct
                )
            )
        );
    };

    const handleProductChange = async (value) => {

        setSelectedProduct(value);
        const comparison =
            await getForecastComparison(
                selectedCategory || "ALL",
                value
            );

        setComparisonData(comparison);

        if (value === "ALL") {
            setFilteredDetails(
                forecastDetails.filter(item =>
                    selectedCategory === "ALL"
                        ? true
                        : item.category === selectedCategory
                )
            );
            setFilteredProducts(
                summary.top_products
            );

            return;
        }

        const data =
            await getProductForecast(value);

        setProductForecast(
            data.forecast
        );

        setFilteredProducts([
            {
                product_name: value,
                quantity:
                    data.forecast.reduce(
                        (sum, row) =>
                            sum + row.forecast_quantity,
                        0
                    )
            }
        ]);
        setFilteredDetails(
            forecastDetails.filter(item =>
                item.product_name === value &&
                (
                    selectedCategory === "ALL" ||
                    item.category === selectedCategory
                )
            )
        );
    };
    const totalPages =
        Math.ceil(
            filteredDetails.length /
            ROWS_PER_PAGE
        );

    const startIndex =
        (currentPage - 1) *
        ROWS_PER_PAGE;

    const currentRows =
        filteredDetails.slice(
            startIndex,
            startIndex + ROWS_PER_PAGE
        );

    if (!summary) {
        return (
            <div className="forecast-page">
                <h2>Loading Forecast Dashboard...</h2>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="forecast-page">

                {/* HEADER */}

                <div className="forecast-header">

                    <div>
                        <h1>
                            Demand Forecast Dashboard
                        </h1>

                        <p>
                            Predict future demand for your products and categories
                        </p>
                        <div className="forecast-filters">
                            <div className="filter-group">

                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        handleCategoryChange(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="ALL">
                                        All Categories
                                    </option>

                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                </div>
                            <div className="filter-group">

                                <select
                                    value={selectedProduct}
                                    onChange={(e) =>
                                        handleProductChange(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="ALL">
                                        All Products
                                    </option>

                                    {products.map((prod, idx) => (
                                        <option key={idx} value={prod}>
                                            {prod}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <button
                        className="export-btn"
                        onClick={handleExport}
                    >
                        <FaDownload />
                        Export CSV
                    </button>


                </div>

                {/* KPI ROW */}


                <div className="forecast-cards">

                    <div className="forecast-card">
                        <span>
                            Next 30 Days Forecast
                        </span>
                        <h2>
                            {forecastTotal}
                        </h2>
                    </div>

                    <div className="forecast-card">
                        <span>
                            Avg. Confidence
                        </span>
                        <h2>
                            {avgConfidence}%
                        </h2>
                    </div>

                    <div className="forecast-card">
                        <span>
                            Products Tracked
                        </span>
                        <h2>
                            {productsTracked}
                        </h2>
                    </div>

                    <div className="forecast-card">
                        <span>
                            Categories
                        </span>
                        <h2>
                            {categoriesTracked}
                        </h2>
                    </div>

                </div>

                {/* MAIN FORECAST CHART */}

                <div className="forecast-grid">

                    <div className="forecast-chart demand-chart">

                        <h3>
                            Demand Trends
                        </h3>

                        <p className="chart-subtitle">
                            Historical vs predicted demand over time
                        </p>

                        <div className="plot-container">

                            <Plot
                                data={[
                                    {
                                        x: comparisonData.map(
                                            item => item.transaction_date
                                        ),

                                        y: comparisonData.map(
                                            item => item.historical
                                        ),

                                        type: "scatter",
                                        mode: "lines+markers",

                                        name: "Historical Demand",

                                        line: {
                                            color: "#3b82f6",
                                            width: 3,
                                        },

                                        marker: {
                                            size: 6,
                                        },
                                    },

                                    {
                                        x: comparisonData.map(
                                            item => item.transaction_date
                                        ),

                                        y: comparisonData.map(
                                            item => item.forecast
                                        ),

                                        type: "scatter",
                                        mode: "lines+markers",

                                        name: "Forecast Demand",

                                        line: {
                                            color: "#10b981",
                                            width: 3,
                                        },

                                        marker: {
                                            size: 6,
                                        },
                                    },
                                ]}
                                layout={{
                                    autosize: true,
                                    height: 420,

                                    dragmode: "zoom",

                                    hovermode: "x unified",

                                    showlegend: true,

                                    legend: {
                                        orientation: "h",
                                    },

                                    margin: {
                                        l: 50,
                                        r: 20,
                                        t: 20,
                                        b: 50,
                                    },

                                    xaxis: {
                                        rangeslider: {
                                            visible: true,
                                        },
                                    },

                                    yaxis: {
                                        fixedrange: false,
                                    },

                                    paper_bgcolor: "transparent",
                                    plot_bgcolor: "transparent",
                                }}
                                config={{
                                    responsive: true,
                                    scrollZoom: true,
                                    displaylogo: false,
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            />

                        </div>

                    </div>


                    {/* TABLES */}


                    <div className="forecast-chart">

                        <h3>
                            Demand by Category
                        </h3>

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <PieChart>

                                <Pie
                                    data={filteredCategories}
                                    dataKey="quantity"
                                    nameKey="aisle"
                                    innerRadius={80}
                                    outerRadius={130}
                                    paddingAngle={3}
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {filteredCategories.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                PIE_COLORS[
                                                index % PIE_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />

                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    layout="horizontal"
                                />

                            </PieChart>
                        </ResponsiveContainer>

                    </div>

                    <div className="forecast-chart">

                        <div className="chart-title">
                            Top Products by Forecasted Demand
                        </div>
                        <div className="chart-scroll">

                            <div
                                style={{
                                    width: "900px",
                                    height: "350px",
                                }}
                            >

                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={filteredProducts}

                                    >
                                        <XAxis type="number" />
                                        <YAxis
                                            type="category"
                                            dataKey="product_name"
                                            width={120}
                                        />
                                        <Tooltip />

                                        <Bar
                                            dataKey="quantity"
                                            fill="#6366f1"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                        </div>
                    </div>
                    <div className="forecast-table">

                        <h3>
                            Forecast Details
                        </h3>

                        <table>
                            <thead>
                                <tr>
                                    <th>DATE</th>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>PREDICTED DEMAND</th>
                                    <th>CONFIDENCE</th>
                                </tr>
                            </thead>

                            <tbody>

                                {currentRows.map((item, index) => (

                                    <tr key={index}>

                                        <td>
                                            {item.date}
                                        </td>

                                        <td>
                                            {item.product_name}
                                        </td>

                                        <td>
                                            {item.category}
                                        </td>

                                        <td>
                                            {Math.round(
                                                item.predicted_demand
                                            )}
                                        </td>

                                        <td>
                                            {item.confidence}%
                                        </td>

                                    </tr>

                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">

                            <button
                                className="pagination-btn"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(currentPage - 1)
                                }
                            >
                                Previous
                            </button>

                            <div className="pagination-pages">

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => (

                                        <button
                                            key={index}
                                            className={
                                                currentPage === index + 1
                                                    ? "page-btn active"
                                                    : "page-btn"
                                            }
                                            onClick={() =>
                                                setCurrentPage(index + 1)
                                            }
                                        >
                                            {index + 1}
                                        </button>

                                    )
                                )}

                            </div>

                            <button
                                className="pagination-btn"
                                disabled={
                                    currentPage === totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(currentPage + 1)
                                }
                            >
                                Next
                            </button>

                        </div>


                    </div>

                </div>

            </div>
        </MainLayout>
    );
}