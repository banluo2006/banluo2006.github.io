const BLOG_DATA = {
  posts: [
    {
      id: "cpp-stl-vector",
      title: "C++ STL Vector 完全指南",
      date: "2026-06-10",
      category: "C++",
      tags: ["STL", "容器", "新手友好"],
      summary: "从原理到实战，一篇文章搞懂 std::vector 的内存分配、扩容机制和最佳实践。",
      readingTime: 8,
      content: `# C++ STL Vector 完全指南

## 什么是 Vector？

\`std::vector\` 是 C++ 标准模板库（STL）中最常用的**动态数组**容器。它提供了连续的内存存储，可以在运行时动态调整大小。

\`\`\`cpp
#include <vector>
#include <iostream>

int main() {
    // 创建 vector
    std::vector<int> vec = {1, 2, 3, 4, 5};

    // 尾部添加元素
    vec.push_back(6);

    // 遍历
    for (int n : vec) {
        std::cout << n << " ";
    }
    // 输出: 1 2 3 4 5 6

    return 0;
}
\`\`\`

## 内存分配机制

Vector 的内存分配策略是它的核心特性：

\`\`\`cpp
std::vector<int> v;
std::cout << "初始容量: " << v.capacity() << std::endl;  // 0

v.push_back(1);
std::cout << "插入1个后: " << v.capacity() << std::endl;  // 1

v.push_back(2);
std::cout << "插入2个后: " << v.capacity() << std::endl;  // 2

v.push_back(3);
std::cout << "插入3个后: " << v.capacity() << std::endl;  // 4 （翻倍扩容！）
\`\`\`

### 扩容规律

大多数 STL 实现采用 **2 倍扩容**策略：
- 当容量不足时，分配一块**新内存**（大小为原来的 2 倍）
- 将旧元素**移动/拷贝**到新内存
- 释放旧内存

> 这种策略保证了 **均摊 O(1)** 的插入时间复杂度。

## 常用操作

### 元素访问

| 方法 | 说明 | 异常安全 |
|:---|:---|:---:|
| \`v[i]\` | 下标访问 | 不检查越界 |
| \`v.at(i)\` | 带边界检查 | 抛 \`std::out_of_range\` |
| \`v.front()\` | 第一个元素 | - |
| \`v.back()\` | 最后一个元素 | - |

### 插入与删除

\`\`\`cpp
std::vector<int> v = {1, 2, 3, 4, 5};

// 尾部操作（高效）
v.push_back(6);     // O(1)
v.pop_back();       // O(1)

// 中间操作（低效，需要移动元素）
v.insert(v.begin() + 2, 99);  // O(n)
v.erase(v.begin() + 1);       // O(n)
\`\`\`

## 性能优化技巧

### 1. 预留容量用 \`reserve\`

\`\`\`cpp
std::vector<int> v;
v.reserve(1000);  // 预先分配 1000 个元素的空间

for (int i = 0; i < 1000; i++) {
    v.push_back(i);  // 0 次扩容，高效！
}
\`\`\`

### 2. 用 \`emplace_back\` 代替 \`push_back\`

\`\`\`cpp
struct Person {
    string name;
    int age;
    Person(string n, int a) : name(n), age(a) {}
};

vector<Person> people;

// push_back：先构造再拷贝/移动
people.push_back(Person("Alice", 25));

// emplace_back：原地构造，省去拷贝
people.emplace_back("Alice", 25);
\`\`\`

## 总结

- \`std::vector\` 是 C++ 中最灵活、最常用的容器
- 理解扩容机制有助于编写高性能代码
- 使用 \`reserve\` 预分配，用 \`emplace_back\` 避免多余拷贝
- 优先用 \`at()\` 或范围 for 循环，避免越界`
    },
    {
      id: "quick-sort",
      title: "C++ 快速排序模板详解",
      date: "2026-06-08",
      category: "算法",
      tags: ["排序", "分治", "面试"],
      summary: "深入分析快速排序的递归与迭代实现，包含随机化优化和三路快排。",
      readingTime: 12,
      content: `# C++ 快速排序模板详解

## 算法思想

快速排序（Quick Sort）采用 **分治策略**：

1. 从数组中选一个 **基准元素（pivot）**
2. 将数组分成两部分：**小于 pivot** 和 **大于 pivot**
3. 对两部分**递归**排序

\`\`\`cpp
void quickSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;

    int pivot = partition(arr, left, right);
    quickSort(arr, left, pivot - 1);
    quickSort(arr, pivot + 1, right);
}
\`\`\`

## 分区函数实现

### Lomuto 分区

\`\`\`cpp
int partition(vector<int>& arr, int left, int right) {
    int pivot = arr[right];  // 选最后一个元素为基准
    int i = left - 1;        // i 指向小于 pivot 的最后一个元素

    for (int j = left; j < right; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[right]);
    return i + 1;
}
\`\`\`

### Hoare 分区（更高效）

\`\`\`cpp
int hoarePartition(vector<int>& arr, int left, int right) {
    int pivot = arr[left];
    int i = left - 1, j = right + 1;

    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        swap(arr[i], arr[j]);
    }
}
\`\`\`

## 时间复杂度分析

| 情况 | 时间复杂度 | 空间复杂度 |
|:---|:---:|:---:|
| **最优** | O(n log n) | O(log n) |
| **平均** | O(n log n) | O(log n) |
| **最差** | O(n²) | O(n) |

## 优化：随机化快速排序

最差情况发生在数组**已经有序**时。随机选择 pivot 可以避免：

\`\`\`cpp
int randomPartition(vector<int>& arr, int left, int right) {
    int random = left + rand() % (right - left + 1);
    swap(arr[random], arr[right]);
    return partition(arr, left, right);
}
\`\`\`

## 三路快速排序

当数组中有大量重复元素时，三路快排将数组分为三部分：**小于、等于、大于** pivot，大幅提升性能：

\`\`\`cpp
void quickSort3Way(vector<int>& arr, int left, int right) {
    if (left >= right) return;

    int pivot = arr[left];
    int lt = left;     // arr[left+1..lt] < pivot
    int gt = right;    // arr[gt..right] > pivot
    int i = left + 1;

    while (i <= gt) {
        if (arr[i] < pivot) {
            swap(arr[lt++], arr[i++]);
        } else if (arr[i] > pivot) {
            swap(arr[i], arr[gt--]);
        } else {
            i++;
        }
    }

    quickSort3Way(arr, left, lt - 1);
    quickSort3Way(arr, gt + 1, right);
}
\`\`\`

## 总结

- 快速排序是实践中最快的通用排序算法
- 随机化 + 三路切分可以避免最差情况
- 对于小数组（< 20 个元素），可以切换到插入排序进一步优化`
    },
    {
      id: "gcd-lcm",
      title: "最大公因数与最小公倍数",
      date: "2026-06-05",
      category: "C++",
      tags: ["数学", "数论", "基础"],
      summary: "欧几里得算法（辗转相除法）的原理与 C++ 实现，以及 GCD 和 LCM 的应用场景。",
      readingTime: 6,
      content: `# 最大公因数与最小公倍数

## 最大公因数（GCD）

### 欧几里得算法（辗转相除法）

核心原理：\`gcd(a, b) = gcd(b, a % b)\`

\`\`\`cpp
// 递归实现
int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

// 迭代实现（更高效，避免栈溢出）
int gcdIterative(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
\`\`\`

### C++17 内置 GCD

\`\`\`cpp
#include <numeric>

int main() {
    int g = std::gcd(12, 18);  // 6
    // C++17 新增，需要 <numeric>
}
\`\`\`

## 最小公倍数（LCM）

公式：\`lcm(a, b) = a / gcd(a, b) * b\`

> 先除后乘，防止溢出！

\`\`\`cpp
int lcm(int a, int b) {
    return a / gcd(a, b) * b;
}
\`\`\`

## 扩展欧几里得算法

不仅可以求 gcd，还能找到整数 x, y 使得：\`ax + by = gcd(a, b)\`

\`\`\`cpp
int exgcd(int a, int b, int& x, int& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    int g = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return g;
}
\`\`\`

## 应用场景

### 1. 分数约分

\`\`\`cpp
struct Fraction {
    int num, den;

    void simplify() {
        int g = gcd(abs(num), abs(den));
        num /= g;
        den /= g;
        if (den < 0) { num = -num; den = -den; }
    }
};
\`\`\`

### 2. 判断互质

\`\`\`cpp
bool isCoprime(int a, int b) {
    return gcd(a, b) == 1;
}
\`\`\`

## 总结

- GCD：欧几里得算法 \`O(log min(a,b))\`
- LCM：先除后乘防溢出
- 扩展欧几里得是 RSA 加密等数论算法的基础`
    },
    {
      id: "big-number-multiply",
      title: "大数相乘算法实现",
      date: "2026-06-03",
      category: "C++",
      tags: ["数学", "字符串", "高精度"],
      summary: "模拟竖式乘法实现任意长度数字相乘，分析与 Karatsuba 算法的性能差异。",
      readingTime: 10,
      content: `# 大数相乘算法实现

当数字超出内置类型（\`long long\`）的范围时，我们需要用字符串模拟乘法运算。

## 竖式乘法（模拟）

### 核心思想

模拟小学数学的竖式乘法，逐位相乘后累加进位。

\`\`\`cpp
string multiply(string num1, string num2) {
    int n = num1.size(), m = num2.size();
    vector<int> result(n + m, 0);

    // 逐位相乘
    for (int i = n - 1; i >= 0; i--) {
        for (int j = m - 1; j >= 0; j--) {
            int mul = (num1[i] - '0') * (num2[j] - '0');
            int sum = mul + result[i + j + 1];

            result[i + j + 1] = sum % 10;      // 当前位
            result[i + j] += sum / 10;          // 进位
        }
    }

    // 转换为字符串
    string s;
    for (int n : result) {
        if (!(s.empty() && n == 0)) {
            s.push_back(n + '0');
        }
    }
    return s.empty() ? "0" : s;
}
\`\`\`

### 时间复杂度

**O(n × m)**，其中 n、m 是两个数字的位数。

## Karatsuba 算法

分治策略，复杂度 **O(n^1.585)**，适用于超大数字（上千位）。

### 原理

将两个 n 位数各分成两半：

\`\`\`
a = a1 * 10^k + a0
b = b1 * 10^k + b0

a * b = (a1*b1) * 10^2k + (a1*b0 + a0*b1) * 10^k + (a0*b0)
\`\`\`

关键优化：\`a1*b0 + a0*b1 = (a1+a0)*(b1+b0) - a1*b1 - a0*b0\`，只需 **3 次乘法** 而非 4 次。

\`\`\`cpp
string karatsuba(const string& a, const string& b) {
    int n = max(a.size(), b.size());
    if (n <= 4) {
        // 小数字直接计算
        return to_string(stoll(a) * stoll(b));
    }

    n = n / 2;
    string a1 = a.substr(0, a.size() - n);
    string a0 = a.substr(a.size() - n);
    string b1 = b.substr(0, b.size() - n);
    string b0 = b.substr(b.size() - n);

    string z0 = karatsuba(a0, b0);
    string z2 = karatsuba(a1, b1);
    string z1 = subtract(
        karatsuba(add(a1, a0), add(b1, b0)),
        add(z2, z0)
    );

    // 合并结果：z2 * 10^(2n) + z1 * 10^n + z0
    return add(add(z2 + string(2*n, '0'), z1 + string(n, '0')), z0);
}
\`\`\`

## 两种算法对比

| 算法 | 时间复杂度 | 适合场景 |
|:---|:---:|:---:|
| 竖式乘法 | O(n²) | 百位以内 |
| Karatsuba | O(n^1.585) | 千位以上 |

> 实际应用中，大整数库（如 GMP）会根据位数自动切换算法。`
    },
    {
      id: "pointers-vs-references",
      title: "C++ 指针与引用完全解析",
      date: "2026-05-28",
      category: "C++",
      tags: ["指针", "引用", "基础"],
      summary: "深入分析指针和引用的本质区别、使用场景以及常见陷阱。",
      readingTime: 10,
      content: `# C++ 指针与引用完全解析

## 核心区别

| 特性 | 指针 | 引用 |
|:---|:---:|:---:|
| 是否可为空 | ✅ 可以是 \`nullptr\` | ❌ 必须初始化 |
| 是否可重新绑定 | ✅ 可以指向不同对象 | ❌ 绑定后不能改变 |
| 是否需要解引用 | ✅ 用 \`*\` 和 \`->\` | ❌ 直接使用 |
| 内存占用 | 通常 8 字节（64位） | 无（编译器别名） |
| 语法复杂度 | 相对复杂 | 简洁直观 |

## 基本用法

\`\`\`cpp
int a = 42;

// 指针
int* ptr = &a;
*ptr = 100;     // a = 100
ptr = nullptr;  // 可以指向空

// 引用
int& ref = a;
ref = 200;      // a = 200
// ref 永远指向 a，无法改变
\`\`\`

## 什么时候用引用？

### 1. 函数参数传递（避免拷贝）

\`\`\`cpp
// 不推荐：传值拷贝整个对象
void processValue(string s) { }

// 推荐：传引用，避免拷贝
void processRef(const string& s) { }

// 需要修改时传非 const 引用
void modify(int& x) {
    x = 99;
}
\`\`\`

### 2. 返回值作为左值

\`\`\`cpp
class Array {
    int data[100];
public:
    int& operator[](int i) {
        return data[i];  // 返回引用，可以赋值
    }
};

Array arr;
arr[0] = 42;  // operator[] 返回引用，可以写
\`\`\`

## 什么时候用指针？

### 1. 可能没有对象

\`\`\`cpp
// 可能失败的操作，返回指针
int* findValue(const vector<int>& v, int target) {
    auto it = find(v.begin(), v.end(), target);
    if (it == v.end()) return nullptr;
    return &(*it);
}
\`\`\`

### 2. 需要动态绑定/多态

\`\`\`cpp
class Base { virtual void foo(); };
class Derived : public Base { void foo() override; };

Base* b = new Derived();
b->foo();  // 调用 Derived::foo()
\`\`\`

### 3. 需要重新指向

\`\`\`cpp
Node* current = head;
while (current) {
    current = current->next;  // 指针可以移动
}
\`\`\`

## 建议总结

> **能用引用就用引用，必要时才用指针。**

- 函数参数传递：\`const T&\`
- 需要修改参数：\`T&\`
- 可能为空：\`T*\`
- 多态数组/容器：\`vector<unique_ptr<Base>>\``
    },
    {
      id: "memory-management",
      title: "C++ 内存管理：堆 vs 栈",
      date: "2026-05-25",
      category: "系统",
      tags: ["内存", "堆栈", "性能"],
      summary: "深入理解 C++ 程序的内存布局、栈与堆的区别，以及智能指针的正确使用方式。",
      readingTime: 14,
      content: `# C++ 内存管理：堆 vs 栈

## 程序内存布局

典型的 C++ 程序内存分为 5 个区域：

\`\`\`
┌──────────────────┐ 高地址
│      栈（Stack）   │ 局部变量、函数调用
├──────────────────┤
│        ↓          │
│      空闲空间       │
│        ↑          │
├──────────────────┤
│      堆（Heap）    │ 动态分配（new/malloc）
├──────────────────┤
│   全局/静态区      │ 全局变量、static 变量
├──────────────────┤
│     代码段         │ 程序指令
└──────────────────┘ 低地址
\`\`\`

## 栈（Stack）

### 特点

- **自动分配和释放**，由编译器管理
- 空间有限（通常 ~1MB~8MB）
- 分配速度极快（只需移动栈指针）

\`\`\`cpp
void stackExample() {
    int a = 10;          // 栈上分配
    int arr[100];        // 栈上分配
    string s = "hello";  // s 在栈上，数据在堆上

    // 函数返回时自动释放
    // 不用担心内存泄漏
}
\`\`\`

## 堆（Heap）

### 特点

- **手动分配和释放**（或通过智能指针）
- 空间大（可用系统内存）
- 分配速度较慢（需要查找空闲块）

\`\`\`cpp
void heapExample() {
    int* p = new int(42);     // 堆上分配
    int* arr = new int[100];  // 堆上分配

    delete p;      // 手动释放
    delete[] arr;  // 数组释放
}
\`\`\`

## 智能指针（C++11+）

现代 C++ 推荐使用智能指针管理堆内存：

\`\`\`cpp
#include <memory>

void smartPtrExample() {
    // unique_ptr：独占所有权
    auto ptr1 = make_unique<int>(42);

    // shared_ptr：共享所有权（引用计数）
    auto ptr2 = make_shared<int>(42);
    {
        auto ptr3 = ptr2;  // 引用计数 +1
    }  // 引用计数 -1

    // 自动释放，无需手动 delete！
}
\`\`\`

### 选择指南

| 场景 | 使用 |
|:---|:---|
| 明确独享所有权 | \`std::unique_ptr\` |
| 共享所有权 | \`std::shared_ptr\` |
| 观察者/不拥有 | 原始指针或 \`std::weak_ptr\` |
| 不需要动态分配 | 栈上对象（优先选择！） |

> **最佳实践：优先使用栈分配！** 只有在需要动态生命期、大对象或多态时才使用堆。`
    },
    {
      id: "learning-roadmap",
      title: "我的 C++ 学习路线",
      date: "2026-05-20",
      category: "经验",
      tags: ["学习路线", "新手", "成长"],
      summary: "从零开始学 C++ 的完整路线图，涵盖基础语法、STL、算法到项目实践的各个阶段。",
      readingTime: 8,
      content: `# 我的 C++ 学习路线

## 第一阶段：基础语法

### 核心内容

- 变量、类型、运算符
- 流程控制（if/for/while）
- 函数与重载
- 数组与字符串

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}
\`\`\`

## 第二阶段：面向对象

- 类和对象
- 构造函数与析构函数
- 继承与多态
- 虚函数

## 第三阶段：STL 标准库

\`\`\`cpp
#include <vector>
#include <algorithm>

// 掌握常用容器和算法
vector<int> v = {4, 1, 3, 5, 2};
sort(v.begin(), v.end());  // 1,2,3,4,5
\`\`\`

### 重点容器

- \`std::vector\` - 动态数组
- \`std::unordered_map\` - 哈希表
- \`std::set\` - 有序集合
- \`std::string\` - 字符串

## 第四阶段：算法与数据结构

从简单的排序到复杂的图算法，**大厂面试必备**。

## 推荐资源

| 类型 | 资源 | 难度 |
|:---|:---|:---:|
| 📖 书籍 | 《C++ Primer》 | ⭐⭐⭐ |
| 📖 书籍 | 《Effective Modern C++》 | ⭐⭐⭐⭐ |
| 🌐 网站 | cppreference.com | 参考文档 |
| 🎯 刷题 | LeetCode / 洛谷 | 实践 |

## 我的进度

- [x] 基础语法
- [x] STL 容器与算法
- [x] 排序算法
- [ ] 图论
- [ ] 设计模式
- [ ] 项目实战

> 学习 C++ 是一条漫长的路，关键是 **坚持** 和 **动手实践**！`
    },
    {
      id: "sorting-visualization",
      title: "十大排序算法可视化",
      date: "2026-05-15",
      category: "算法",
      tags: ["排序", "可视化", "动画"],
      summary: "通过 ECharts 动态可视化冒泡、快排、归并等经典排序算法的工作原理和性能对比。",
      readingTime: 15,
      content: `# 十大排序算法可视化

## 排序算法分类

### 比较排序

| 算法 | 平均时间 | 最差时间 | 空间 | 稳定 |
|:---|:---:|:---:|:---:|:---:|
| 冒泡排序 | O(n²) | O(n²) | O(1) | ✅ |
| 选择排序 | O(n²) | O(n²) | O(1) | ❌ |
| 插入排序 | O(n²) | O(n²) | O(1) | ✅ |
| 希尔排序 | O(n log n) | O(n²) | O(1) | ❌ |
| 归并排序 | O(n log n) | O(n log n) | O(n) | ✅ |
| 快速排序 | O(n log n) | O(n²) | O(log n) | ❌ |
| 堆排序 | O(n log n) | O(n log n) | O(1) | ❌ |

### 非比较排序

| 算法 | 时间 | 空间 | 条件 |
|:---|:---:|:---:|:---|
| 计数排序 | O(n+k) | O(k) | 整数，范围小 |
| 基数排序 | O(n×k) | O(n+k) | 整数/固定长度字符串 |
| 桶排序 | O(n+k) | O(n) | 均匀分布 |

## 冒泡排序

\`\`\`cpp
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;  // 优化：已有序提前退出
    }
}
\`\`\`

## 归并排序

\`\`\`cpp
void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;

    while (i <= mid && j <= right)
        temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
    while (i <= mid)  temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    for (i = 0; i < k; i++)
        arr[left + i] = temp[i];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
\`\`\`

## 如何选择合适的排序算法？

- **小数据量（< 50）**：插入排序
- **大部分已有序**：插入排序（O(n)）
- **大数据量**：快速排序（最快）或归并排序（稳定）
- **数据范围小**：计数排序（O(n)）`
    }
  ],

  // 技能数据
  skills: {
    cpp: 85,
    algorithms: 70,
    stl: 75,
    os: 50,
    web: 40
  },

  // 学习时间线
  timeline: [
    { date: "2024-09", title: "开始学习 C++", desc: "从变量、循环开始入门编程世界" },
    { date: "2025-01", title: "算法入门", desc: "学习排序、搜索等基础算法" },
    { date: "2025-06", title: "STL 源码阅读", desc: "深入理解 vector、map 等容器实现" },
    { date: "2026-01", title: "开始写博客", desc: "记录学习心得，分享技术收获" },
    { date: "2026-06", title: "持续精进中...", desc: "探索更多 C++ 深度知识" },
  ]
};
