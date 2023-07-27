<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$mysqli_config = array(
    'host' => 'localhost',
    'user' => 'root',
    'pass' => 'Ramita0203',
    'dbname' => 'invoicehubgit',
    'socket' => '/tmp/mysql.sock' 
);

$mysqli = new mysqli($mysqli_config['host'], $mysqli_config['user'], $mysqli_config['pass'], $mysqli_config['dbname'], null, $mysqli_config['socket']);
if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
}

$query = $mysqli->query("
    SELECT 
    month,
    SUM(total) as total
    FROM invoices
    GROUP BY month;
");

$month = [];
$amount = [];

foreach ($query as $data) {
    $month[] = $data['month'];
    $amount[] = $data['total'];
}

$data = array(
    'labels' => $month,
    'datasets' => array(
        array(
            'label' => 'My First Dataset',
            'data' => $amount,
            'backgroundColor' => array(
                'rgba(54, 162, 235, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ),
            'borderColor' => array(
                'rgb(54, 162, 235)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ),
            'borderWidth' => 1
        )
    )
);

header('Content-Type: application/json');
echo json_encode($data);
?>
