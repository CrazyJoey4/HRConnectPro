import matplotlib.pyplot as plt

# Sample data
x = [1, 2, 3, 4, 5]
y = [10, 14, 8, 12, 6]

# Create a bar chart
plt.bar(x, y)

# Set labels and title
plt.xlabel('X-Axis')
plt.ylabel('Y-Axis')
plt.title('Sample Bar Chart')

# Save the chart as an image file (e.g., PNG)
plt.savefig('graph.png')

# Show the chart (optional)
# plt.show()