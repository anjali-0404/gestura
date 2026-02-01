import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String message = "Loading...";

  @override
  void initState() {
    super.initState();
    fetchMessage();
  }

  Future<void> fetchMessage() async {
    final url = Uri.parse('http://127.0.0.1:8000/');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      setState(() {
        message = jsonDecode(response.body)['message'];
      });
    } else {
      setState(() {
        message = "Failed to fetch message";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Flutter + FastAPI')),
        body: Center(child: Text(message)),
      ),
    );
  }
}
